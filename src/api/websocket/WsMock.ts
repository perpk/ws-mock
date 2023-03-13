import http, { Server as HttpServer } from 'http'
import WebSocket, { WebSocketServer } from 'ws'
import CacheManager from '../../cache/CacheManager'
import Mapping from '../../domain/mapping/Mapping'
import Trigger from '../../domain/trigger/Trigger'
import Log from '../../utils/logging/Log'

const { Server } = WebSocket

export default class WsMock {
  private static _instance: WsMock = null

  private _webSocketServer: WebSocketServer = null

  private _server: HttpServer

  private _wsPort: number

  private _log = Log.getLogger(WsMock.name)

  private constructor(wsPort: number) {
    this._server = http.createServer()
    this._wsPort = wsPort
  }

  public static instance(wsPort: number): WsMock {
    if (WsMock._instance === null) {
      WsMock._instance = new WsMock(wsPort)
    }
    return WsMock._instance
  }

  public create(): WsMock {
    if (this._webSocketServer === null) {
      this._webSocketServer = new Server({ server: this._server })
    }
    return this
  }

  public start(): WsMock {
    this._server.listen(this._wsPort, () => {
      this._log.info(`Running WebSocket Server on port ${this._wsPort}`)
    })
    return this
  }

  public stop(): void {
    this._server.close((err) => {
      if (err) {
        this._log.error(err.message)
      } else {
        this._log.info('WebSocket Server closed succcessfully')
      }
    })
  }

  public addMapping(mapping: Mapping): WsMock {
    CacheManager.createEntry(mapping)
    return this
  }

  public removeMappings(): WsMock {
    CacheManager.removeAll()
    return this
  }

  public triggerWsServer(trigger: Trigger): WsMock {
    const entry = CacheManager.getEntry(trigger.path)
    let atLeastOneClientAvailable = false
    this._webSocketServer.clients.forEach((client) => {
      if (
        client.readyState === WebSocket.OPEN &&
        client['path'] === trigger.path
      ) {
        this._log.debug('Sending to client')
        client.send(JSON.stringify(entry))
        atLeastOneClientAvailable = true
      }
    })
    if (!atLeastOneClientAvailable) {
      this._log.warn(`No clients subscribed for path ${trigger.path}.`)
    }
    return this
  }

  /**
   * ! It could be good for something, figure out what :P
   */
  // public executeOnConnection(callback: Function): WsMock {
  //   callback()
  //   return this
  // }
}
