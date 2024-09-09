import compression, { CompressionOptions } from 'compression';
import { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';

export const compressionOptions: CompressionOptions = {
  threshold: 2048, //! Only compress responses larger than 1KB
  filter: (req: Request, res: Response) => {
    if (req.headers['x-no-compression']) {
      // Don't compress responses if this request header is present
      return false;
    }
    return compression.filter(req, res);
  },
};

export const limiterRate = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
  message: 'Too many requests, please try again later.', // Customize error message sent in response to rate limit exceeded.
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  skip: (req, res) => ['192.168.10.239'].includes(req.ip),  //those will pass through the limit request
});
