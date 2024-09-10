import compression, { CompressionOptions } from 'compression';

import express, { Application,Request, Response } from 'express';
const app: Application = express();



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

app.use(compression(compressionOptions));
///! used for compressing the response at large response .
//// It will reduce the response time & size


app.get('/large-response', (req, res) => {
  const largeData = Array(100000).fill('Lorem ipsum dolor sit emet...');
  res.json({ data: largeData });
});
