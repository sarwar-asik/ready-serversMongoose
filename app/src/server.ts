import mongoose from 'mongoose';
import 'colors';
import app from './app';
import { Server } from 'http';
import { errorLogger, logger } from './shared/logger';
import config from './config/index';
import { directoryManager } from './common/utils/runFileUploadFolder';
import os from 'os';
import { updateServerTime } from './common/utils/serverMonitor';

mongoose.set('strictQuery', false);

class ServerManager {
  private server?: Server;

  constructor() {
    this.handleUncaughtException();
    this.handleUnhandledRejection();
    this.handleSigterm();
  }

  private logInfo(message: (() => string) | string) {
    const msg = typeof message === 'function' ? message() : message;
    config.env === 'production' ? logger.info(msg) : console.log(msg);
  }
  public async start(): Promise<void> {
    await this.connectDatabase();
    this.startServer();
  }

  private handleUncaughtException() {
    process.on('uncaughtException', error => {
      this.logError('uncaughtException is detected ......', error);
      process.exit(1);
    });
  }

  private handleUnhandledRejection() {
    process.on('unhandledRejection', error => {
      if (this.server) {
        this.server.close(() => {
          this.logError('Unhandled Rejection:', error);
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    });
  }
  private handleSigterm() {
    process.on('SIGTERM', () => {
      console.log('SIGTERM is received ....');
      if (this.server) {
        this.server.close(() => {
          process.exit(0); // Ensure process exits so ts-node-dev can restart
        });
      } else {
        process.exit(0);
      }
    });
  }

  private async connectDatabase() {
    try {
      await mongoose.connect(config.database_url as string, {
        dbName: `${config.server_name}-DB`,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      this.logInfo('Database connection successful'.green.underline.bold);
    } catch (error) {
      this.logError('Failed to connect database:', error);
    }
  }

  private startServer() {
    const port = Number(config.port) || 5000;
    this.server = app.listen(port, '0.0.0.0', () => {
      updateServerTime();
      const protocol =
        config.env === 'production' && config.https ? 'https' : 'http';
      const host = this.getHost();
      const message = `Server running on the ${protocol}://${host}:${port}`
        .yellow.underline.bold;
      this.logInfo(message);
      directoryManager.ensureDirectoriesExist();
    });
  }

  private getHost(): string {
    let host = '0.0.0.0';
    const networks = os.networkInterfaces();
    const network =
      networks['Ethernet'] ||
      networks['Wi-Fi'] ||
      networks['eth0'] ||
      networks['wlan0'];
    if (network) {
      const ipv4 = network.find(ip => ip.family === 'IPv4' && !ip.internal);
      if (ipv4) {
        host = ipv4.address;
      }
    }
    return host;
  }

  private logError(message: string, error: any) {
    const errorMsg = `${message} ${error?.message || error}`.red.bold;
    if (config.env === 'production') {
      errorLogger.error(typeof errorMsg === 'function' ? errorMsg() : errorMsg);
    } else {
      console.log(errorMsg);
    }
  }
}

const serverManager = new ServerManager();
serverManager.start();
