import NodeCache from 'node-cache';
import Mapping from '../domain/mapping/Mapping';
import MappingValidator from '../domain/mapping/MappingValidator';
import CacheEntryNotFoundException from './CacheEntryNotFoundException';

class CacheManager {
  private cache: NodeCache

  constructor() {
    this.cache = new NodeCache()
  }

  public createEntry(mapping: Mapping): void {
    MappingValidator.validate(mapping);
    if (this.cache.has(mapping.path)) {
      const multiple = [mapping.response, this.cache.get(mapping.path)]
      this.cache.set(mapping.path, multiple)
    } else {
      this.cache.set(mapping.path, mapping.response)
    }
  }

  public getEntry(key: string): object | null {
    const entry: object = this.cache.get(key)
    if (!entry) {
      throw new CacheEntryNotFoundException(`No Cache entry found for key ${key}.`)
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

  public removeAll(): void {
    this.cache.del(this.cache.keys());
  }
}

export default new CacheManager()
