import { Request, Response, NextFunction } from 'express';
import { name } from '../../package.json';
import { Redis } from '../redis';

const keyPrefix = `__${name}__`;

interface CacheResponse extends Response {
  sendResponse?: Response['send'];
}

type CacheMiddleware = (
  duration: number // seconds
) => (req: Request, res: CacheResponse, next: NextFunction) => void;

// Sends a cached response from send for subsequent requests
const cacheMiddleware: CacheMiddleware = (duration) => {
  const cacheDuration = duration * 1000; // seconds

  return async (req, res, next) => {
    const redis = Redis.getConnection();
    await redis.connect();
    const key = keyPrefix + req.originalUrl;
    const cachedContent = await redis.get(key);

    if (cachedContent) {
      console.info(
        'Accessing cached image' + (req.query?.url ? ` - ${req.query.url}` : '')
      );
      res.set({
        'Content-Type': 'image/png',
        'Content-Length': cachedContent.length,
      });
      await redis.disconnect();
      return res.send(Buffer.from(cachedContent, 'base64'));
    } else {
      // Store in cache for send
      res.sendResponse = res.send;

      (res.send as any) = async (data: string): Promise<CacheResponse> => {
        await redis.set(key, Buffer.from(data).toString('base64'));
        await redis.expire(key, 86400);
        res.sendResponse?.(data);
        await redis.disconnect();
        return res;
      };
      next();
    }
  };
};

export default cacheMiddleware;
