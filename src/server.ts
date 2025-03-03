/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
import mongoose from 'mongoose';
import 'colors';
import app from './app';
import { Server } from 'http';
import { errorLogger, logger } from './shared/logger';
import config from './config/index';
import { createDirectories } from './utils/runFileUploadFolder';
import os from 'os';
import { updateServerTime } from './utils/serverMonitor';
mongoose.set('strictQuery', false);

process.on('uncaughtException', error => {
  config.env === 'production'
    ? errorLogger.error(error)
    : console.log('uncaughtException is detected ......', error);
  process.exit(1);
});


let server: Server;

// Initialize the server variable with a value
// eslint-disable-next-line prefer-const
server = new Server();

// ! for cpu port and host
server = app.listen(config.port || 5002 as any, '0.0.0.0', (): void => {
  updateServerTime();
  const protocol = config.env === 'production' && config.https ? 'https' : 'http';
  let host = '0.0.0.0';

  // Get the actual IP address for display purposes
  const networks = os.networkInterfaces();
  const network = networks['Ethernet'] || networks['Wi-Fi'] || networks['eth0'] || networks['wlan0'];

  if (network) {
    const ipv4 = network.find(ip => ip.family === 'IPv4' && !ip.internal);
    if (ipv4) {
      host = ipv4.address;
    }
  }

  config.env === 'production'
    ? logger.info(`Server running on ${protocol}://${host}:${config.port || 5002}`.yellow.underline.bold)
    : console.log(`Server running on ${protocol}://${host}:${config.port || 5002}`.yellow.underline.bold);

  createDirectories();
});

// console.log(config.data_url, 'config file Data'.red.bold);
async function connection() {
  try {
    await mongoose.connect(config.database_url as string, {
      dbName: `${config.server_name}-DB`,
    });
    config.env === 'production'
      ? logger.info(`Database connection successful.`.green.underline.bold)
      : console.log(`Database connection successful.`.green.underline.bold);
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
