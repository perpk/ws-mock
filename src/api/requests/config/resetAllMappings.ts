import { Response } from 'express'
import CacheManager from '../../../cache/CacheManager'

export default function resetAllMappings() {
  return (_, res: Response) => {
    CacheManager.removeAll()
    res.status(204).send()
  }
}
