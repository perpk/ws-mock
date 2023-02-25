import _ from 'lodash'
import { Request, Response } from 'express'
import CacheManager from '../../../cache/CacheManager'
import WsMock from '../../websocket/WsMock'

function triggerWebSocketServer(webSocketServer: WsMock) {
  return (req: Request, res: Response) => {
    if (_.isEmpty(req.body)) {
        res.status(400).json({ error: 'Request body was empty' }).send()
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

    webSocketServer.triggerWsServer(trigger);
  
  }
}
