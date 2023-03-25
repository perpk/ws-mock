import express, { Express, json } from 'express'
import Log from '../../utils/logging/Log'
import { Server } from 'http'
import triggerWebSocketServer from '../requests/config/triggerWebSocketServer'
import WsMock from '../websocket/WsMock'
import getMappings from '../requests/config/getMappings'
import createMapping from '../requests/config/createMapping'
import resetAllMappings from '../requests/config/resetAllMappings'

export default class HttpControlApi {
  private static _instance: HttpControlApi = null

  private _httpServer: Express = null

  private _httpPort: number

  private _log = Log.getLogger(HttpControlApi.name)

  private _server: Server

  private constructor(httpPort: number) {
    this._httpPort = httpPort
  }

  public static instance(httpPort: number): HttpControlApi {
    if (HttpControlApi._instance === null) {
      HttpControlApi._instance = new HttpControlApi(httpPort)
    }
    return HttpControlApi._instance
  }

  public create(): HttpControlApi {
    if (this._httpServer === null) {
      this._httpServer = express()
      this._httpServer.use(json())

      const wsMock: WsMock = WsMock.instance(9999)

      this._httpServer.post('/__config/trigger', triggerWebSocketServer(wsMock))
      this._httpServer.get('/__config/mappings', getMappings())
      this._httpServer.post('/__config/create', createMapping())
      this._httpServer.delete('/__config/resetAll', resetAllMappings())
    }
    return this
  }

  public start(): HttpControlApi {
    this._server = this._httpServer.listen(this._httpPort, () => {
      this._log.info(`Running HTTP Server on port ${this._httpPort}`)
    })
    return this
  }

  public stop(): void {
    this._server.close(() => {
      this._log.info('Stopped HTTP Server.')
    })
  }
}
