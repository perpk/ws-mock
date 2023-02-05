import WebSocket, { WebSocketServer } from 'ws'
import express, { Express, Request, Response } from 'express'
import http from 'http'
import _ from 'lodash'
import CacheManager from './cache/CacheManager'
import * as dotenv from 'dotenv';
import parseArgs from 'minimist';

const argv = parseArgs(process.argv.slice(2));

dotenv.config();

const app: Express = express()
const server = http.createServer()

app.use(express.json())
const wsServer: WebSocketServer = new WebSocket.Server({ server: server })

wsServer.on('connection', (ws, message) => {
  console.log('A new client connected')
  ws.send('ACK')
  ws['path'] = message.url

  ws.on('message', (message) => {
    console.log(`received ${message}`)
  })
})

const emptyBodyResponse = (res: Response): void => {
  res.status(400).json({ error: 'Request body was empty' }).send()
}

app.post('/__config/mapping', (req: Request, res: Response) => {
  if (_.isEmpty(req.body)) {
    return emptyBodyResponse(res)
  }

  let mapping: Mapping
  try {
    mapping = req.body
  } catch (error) {
    res.status(409).json({ error: error.message }).send()
  }

  CacheManager.createEntry(mapping)
  res.status(204).send()
})

app.get('/__config/mappings', (_, res: Response) => {
  res.status(200).json(CacheManager.getAllEntries()).send()
})

app.post('/__config/trigger', (req: Request, res: Response) => {
  if (_.isEmpty(req.body)) {
    return emptyBodyResponse(res)
  }
  let trigger: Trigger
  try {
    trigger = req.body
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
  const entry = CacheManager.getEntry(trigger.path)
  if (entry === null) {
    return res
      .status(404)
      .json({ error: `No mapping found for ${trigger.path}!` })
      .send()
  }
  let atLeastOneClientAvailable = false;
  wsServer.clients.forEach((client) => {
    if (
      client.readyState === WebSocket.OPEN &&
      client['path'] === trigger.path
    ) {
      client.send(JSON.stringify(entry));
      atLeastOneClientAvailable = true;
    }
  })
  if (atLeastOneClientAvailable === false) {
    res.status(404).json({ error: `No clients subscribed for path ${trigger.path}`});
  }
  res.status(204).send()
})

server.listen(getConfedPorts().websocketPort, () => {
  console.log(`Running WS Server on port ${getConfedPorts().websocketPort}`)
})

app.listen(getConfedPorts().httpPort, () => {
  console.log(`Running HTTP Server for config on port ${getConfedPorts().httpPort}`)
})

function getConfedPorts() {
  let httpPort = process.env.HTTP_PORT;
  if (argv.httpPort) {
    httpPort = argv.httpPort;
  }
  let websocketPort = process.env.WEBSOCKET_PORT;
  if (argv.websocketPort) {
    websocketPort = argv.websocketPort;
  }
  return {
    httpPort,
    websocketPort
  };
}
