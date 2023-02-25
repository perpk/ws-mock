import * as log from 'bunyan'

export default class Log {
  public static getLogger(service: string, level: string = 'info'): any {
    return log.createLogger({ name: service, level })
  }
}
