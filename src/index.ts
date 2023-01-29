import WebSocket, { WebSocketServer } from 'ws'
import express, {Express, Request, Response} from 'express'
import http from 'http'

const app: Express = express()
const server = http.createServer()

const wsServer: WebSocketServer = new WebSocket.Server({ server: server })

wsServer.on('connection', (ws) => {
    console.log('A new client connected')
    ws.send('ACK')

    ws.on('message', (message) => {
        console.log(`received ${message}`)
    })
})

app.get('/__config/trigger', (req: Request, res: Response) => {
    wsServer.clients.forEach((c) => {
        if (c.readyState === WebSocket.OPEN) {
            c.send('a message')
        }
    })
    return res.status(204).send()
})

app.get('/__config', (req: Request, res: Response) => {
    res.send('Configuration Endpoint')
})

server.listen(1234, () => {
    console.log('Running WS Server...')
})

app.listen(8888, () => {
    console.log('Running HTTP Server for config...')
})

// wsServer.on('data', (message, reply) => {
//     if (!message) {
//         console.log('no content sent')
//         return
//     }
//     console.log('received')
//     return reply(message)
// })

// const startServer = (port: number): WebSocketServer => {
//   return new WebSocketServer({
//     port: port
//   })
// }

// const server: WebSocketServer = startServer(1234)

// server.on('connection', function connection(ws: WebSocket) {
//     ws.on('message', function message(data: any) {
//         console.log(`server received ${data}`) //4
//     })

//     ws.send('Hello') //1 
// })

// const webSocket: WebSocket = new WebSocket('ws://localhost:1234')

// webSocket.on('open', function open() {
//     webSocket.send('Some message')//2
// })

// webSocket.on('message', function message(data: any) {
//     console.log(`client received ${data}`) //3
// })
