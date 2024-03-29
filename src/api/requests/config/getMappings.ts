import { Response } from 'express'
import CacheManager from '../../../cache/CacheManager'

export default function getMappings() {
  return (_, res: Response) => {
    res.status(200).json(JSON.stringify(CacheManager.getAllEntries())).send()
  }
}
