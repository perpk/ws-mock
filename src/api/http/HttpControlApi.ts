import express, { Express } from 'express'
import Log from '../../utils/logging/Log'
import { Server } from 'http'

export default class HttpControlApi {
  private static _instance: HttpControlApi = null

  private static _httpServer: Express

  private _httpPort: number

  private _log = Log.getLogger(HttpControlApi.name)

  private _server: Server

  private constructor(httpPort: number) {
    this._httpPort = httpPort
  }

  public instance(httpPort: number): HttpControlApi {
    if (HttpControlApi._instance === null) {
      HttpControlApi._instance = new HttpControlApi(httpPort)
    }
    return HttpControlApi._instance
  }

  public create(): HttpControlApi {
    if (HttpControlApi._httpServer === null) {
      HttpControlApi._httpServer = express()
      HttpControlApi._httpServer.use(express.json())
    }
    return this
  }

  public start(): HttpControlApi {
    this._server = HttpControlApi._httpServer.listen(this._httpPort, () => {
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
