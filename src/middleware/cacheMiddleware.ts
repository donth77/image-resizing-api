import { Request, Response, NextFunction } from 'express';
import cache from 'memory-cache';
import { name } from '../../package.json';

const keyPrefix = `__${name}__`;

interface CacheResponse extends Response {
  sendResponse?: Response['send'];
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
      console.info(
        'Accessing cached image' + (req.query?.url ? ` - ${req.query.url}` : '')
      );
      res.set({
        'Content-Type': 'image/png',
        'Content-Length': cachedContent.length,
      });
      return res.send(cachedContent);
    } else {
      // Store in cache for send
      res.sendResponse = res.send;
      res.send = (path: string): CacheResponse => {
        cache.put(key, path, cacheDuration);
        res.sendResponse?.(path);
        return res;
      };
      next();
    }
  };
};

export default cacheMiddleware;
