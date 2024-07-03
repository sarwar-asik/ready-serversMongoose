/* eslint-disable no-console */
import mongoose from 'mongoose';
// import config from './config/index.js';
import 'colors';
// import { logger, errorLogger } from './shared/logger';
import app from './app';
import { Server } from 'http';
import config from './config';

process.on('uncaughtException', err => {
  console.log('UnCaught rejection is detected from serve.ts', err);
  process.exit(1);
});

let server: Server;

console.log(config.data_url, 'config file Data'.red.bold);

async function mainFUnction() {
  try {
    await mongoose.connect(config.data_url as string, {
      dbName: 'Serwar-DB',
    });

    console.log('db Connected successfully '.green.underline.bold);

    server = app.listen(config.port, () => {
      console.log(`server app listening on port ${config.port}`.green.bold);
    });
  } catch (error) {
    // const  {name,message,stack}=error;
    console.log('failed to connect '.red.underline, error);
  }

  process.on('unhandledRejection', error => {
    // eslint-disable-next-line no-console
    console.log(
      'UnHandle rejection is detected and closing the main() in serve.ts'
    );
    if (server) {
      server.close(() => {
        console.log(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

process.on('SIGTERM', () => {
  console.log('SIGTERM is received ');
  if (server) {
    server.close();
  }
});

// console.log(config.port,"url".green.bold);

mainFUnction();
