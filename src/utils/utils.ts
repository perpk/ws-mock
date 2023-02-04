import sha1 from 'sha1';

export const getHash = (value: string): string => {
    return sha1(value);
}