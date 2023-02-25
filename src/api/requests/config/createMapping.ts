import _ from 'lodash'
import { Request, Response } from 'express'
import Mapping from '../../../domain/mapping/Mapping'
import CacheManager from '../../../cache/CacheManager'

function createMapping() {
  return (req: Request, res: Response) => {
    if (_.isEmpty(req.body)) {
      res.status(400).json({ error: 'Request body was empty' }).send()
    }

    let mapping: Mapping
    try {
      mapping = req.body
    } catch (error) {
      res.status(409).json({ error: error.message }).send()
    }
    CacheManager.createEntry(mapping)
    res.status(204).send()
  }
}
