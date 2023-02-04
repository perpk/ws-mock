import NodeCache from 'node-cache';
import { getHash } from '../utils/utils';

class CacheManager {
    private cache: NodeCache

    constructor() {
        this.cache = new NodeCache();
    }

    public createEntry(mapping: Mapping): void {
        this.cache.set(getHash(mapping.path), mapping.response);
    }

    public getEntry(key: string): object | null {
        const keyHash = getHash(key);
        const entry: object = this.cache.get(keyHash);
        if (!entry) {
            return null;
        }
        return entry;
    }
}

export default new CacheManager();