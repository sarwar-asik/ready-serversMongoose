import compression, { CompressionOptions } from 'compression';
import { Request, Response } from 'express';

const compressionOptions: CompressionOptions = {
  threshold: 2048, //! Only compress responses larger than 1KB
  filter: (req: Request, res: Response) => {
    if (req.headers['x-no-compression']) {
      // Don't compress responses if this request header is present
      return false;
    }
    return compression.filter(req, res);
  },
};

export default compressionOptions;
