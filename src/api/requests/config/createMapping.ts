import _ from 'lodash'
import { Request, Response } from 'express'
import Mapping from '../../../domain/mapping/Mapping'
import CacheManager from '../../../cache/CacheManager'

export default function createMapping() {
  return (req: Request, res: Response) => {
    if (_.isEmpty(req.body)) {
      res.status(400).json(JSON.stringify({ error: 'Request body was empty' })).send()
    }

    let mapping: Mapping
    try {
      mapping = req.body
      CacheManager.createEntry(mapping)
    } catch (error) {
      res.status(409).json(JSON.stringify({ error: error.message })).send()
    }
    res.status(204).send()
  }
}
