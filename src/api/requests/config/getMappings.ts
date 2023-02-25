import { Response } from 'express'
import CacheManager from '../../../cache/CacheManager'

function getMappings() {
  return (_, res: Response) => {
    res.status(200).json(CacheManager.getAllEntries()).send()
  }
}
