/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
import mongoose from 'mongoose';
// import config from './config/index.js';
import 'colors';
// import { logger, errorLogger } from './shared/logger';
import app from './app';
import { Server } from 'http';
// import config from './config';
import { errorLogger, logger } from './shared/logger';
import config from './config/index';
import { createDirectories } from './utils/runFileUploadFolder';
import os from 'os';
mongoose.set('strictQuery', false);

process.on('uncaughtException', error => {
  config.env === 'production'
    ? errorLogger.error(error)
    : console.log('uncaughtException is detected ......', error);
  process.exit(1);
});


let server: Server;

// ! for cpu port and host
const protocol = config.env === 'production' && config.https ? 'https' : 'http';
let host = 'localhost';

for (const iface of Object.values(os.networkInterfaces())) {
  if (iface) {
    for (const entry of iface) {
      if (entry.family === 'IPv4' && !entry.internal) {
        host = entry.address; // First non-internal IPv4 address
        break;
      }
    }
  }
}
// console.log(config.data_url, 'config file Data'.red.bold);
async function connection() {
  try {
    await mongoose.connect(config.database_url as string, {
      dbName: 'Ready-Server',
    });
    config.env === 'production'
      ? logger.info(`Database connection successful`.green.underline.bold)
      : console.log(`Database connection successful`.green.underline.bold);

    app.listen(config.port, (): void => {
      config.env === 'production'
        ? logger.info(
            `The Server is listening on port ${protocol}://${host}:${config.port}`.yellow.underline.bold
          )
        : console.log(
            `The Server is listening on port ${protocol}://${host}:${config.port}`.yellow.underline.bold
          );
      createDirectories();
    });
  } catch (error) {
    config.env === 'production'
      ? errorLogger.error(`Failed to connect database: ${error}`.red.bold)
      : console.log(`Failed to connect database: ${error}`.red.bold);
  }

  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        config.env === 'production'
          ? errorLogger.error(error)
          : console.log(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}
connection();

process.on('SIGTERM', () => {
  // logger.info('SIGTERM is received ....');
  console.log('SIGTERM is received ....');
  if (server) {
    server.close();
  }
});

// console.log(config.port,"url".green.bold);
