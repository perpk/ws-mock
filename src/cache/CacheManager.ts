import NodeCache from 'node-cache';
import Mapping from '../domain/mapping/Mapping';
import MappingValidator from '../domain/mapping/MappingValidator';

class CacheManager {
  private cache: NodeCache

  constructor() {
    this.cache = new NodeCache()
  }

  public createEntry(mapping: Mapping): void {
    MappingValidator.validate(mapping);
    this.cache.set(mapping.path, mapping.response)
  }

  public getEntry(key: string): object | null {
    const entry: object = this.cache.get(key)
    if (!entry) {
      return null
    }
    return entry
  }

  public getAllEntries(): Array<Mapping> {
    const mappings: Array<Mapping> = new Array()
    const allCacheKeys: Array<string> = this.cache.keys()
    for (const key of allCacheKeys) {
      mappings.push({ path: key, response: this.cache.get(key) })
    }
    return mappings
  }
}

export default new CacheManager()
