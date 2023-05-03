import { Request, Response, NextFunction } from 'express';
import cache from 'memory-cache';
import fs from 'fs';
import { name } from '../../package.json';

const keyPrefix = `__${name}__`;

interface CacheResponse extends Response {
  sendFileResponse?: Response['sendFile'];
}

type CacheMiddleware = (
  duration: number // seconds
) => (req: Request, res: CacheResponse, next: NextFunction) => void;

// Sends a cached response from sendFile for subsequent requests
const cacheMiddleware: CacheMiddleware = (duration) => {
  const cacheDuration = duration * 1000; // seconds

  return (req, res, next) => {
    const key = keyPrefix + req.originalUrl;
    const cachedContent = cache.get(key);

    if (cachedContent) {
      if (fs.existsSync(cachedContent)) {
        console.info(`Accessing cached image - ${cachedContent}`);
        return res.sendFile(cachedContent);
      }
      next();
    } else {
      // Store in cache for sendFile
      res.sendFileResponse = res.sendFile;
      res.sendFile = (path: string): CacheResponse => {
        cache.put(key, path, cacheDuration);
        res.sendFileResponse?.(path);
        return res;
      };
      next();
    }
  };
};

export default cacheMiddleware;
