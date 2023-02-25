export default class CacheEntryNotFoundException extends Error {

    constructor(msg: string) {
        super(msg);
    }
}