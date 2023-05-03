import { Request, Response, NextFunction } from 'express';
import cache from 'memory-cache';
import fs from 'fs';
import { name } from '../../package.json';

// const { name } = require('../../package.json');
const keyPrefix = `__${name}__`;

interface CacheResponse extends Response {
  sendResponse?: Response['send'];
  sendFileResponse?: Response['sendFile'];
}

type CacheMiddleware = (
  duration: number // seconds
) => (req: Request, res: CacheResponse, next: NextFunction) => void;

const cacheMiddleware: CacheMiddleware = (duration) => {
  const cacheDuration = duration * 1000; // seconds

  return (req, res, next) => {
    const key = keyPrefix + req.originalUrl;
    const cachedContent = cache.get(key);

    const putInCache = <T>(value: T) => {
      cache.put(key, value, cacheDuration);
    };

    if (cachedContent) {
      if (fs.existsSync(cachedContent)) {
        return res.sendFile(cachedContent);
      }
      return res.send(cachedContent);
    } else {
      res.sendResponse = res.send;
      res.send = <T>(body: T): CacheResponse => {
        putInCache(body);
        res.sendResponse?.(body);
        return res;
      };

      res.sendFileResponse = res.sendFile;
      res.sendFile = (path: string): CacheResponse => {
        putInCache(path);
        res.sendFileResponse?.(path);
        return res;
      };
      next();
    }
  };
};

export default cacheMiddleware;
