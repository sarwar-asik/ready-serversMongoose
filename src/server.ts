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
mongoose.set('strictQuery', false);

process.on('uncaughtException', error => {
  config.env === 'production'
    ? errorLogger.error(error)
    : console.log('uncaugthException is detected ......', error);
  process.exit(1);
});

let server: Server;

// console.log(config.data_url, 'config file Data'.red.bold);

async function connection() {
  try {
    await mongoose.connect(config.database_url as string, {
      dbName: 'Antopolis-Server',
    });
    config.env === 'production'
      ? logger.info(`Database connection successful`.green.underline.bold)
      : console.log(`Database connection successful`.green.underline.bold);

    app.listen(config.port, (): void => {
      config.env === 'production'
        ? logger.info(
            `Server is listening on port ${config.port}`.red.underline.bold
          )
        : console.log(
            `Server is listening on port ${config.port}`.red.underline.bold
          );
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
