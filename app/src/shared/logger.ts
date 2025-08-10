import {
  createLogger,
  format,
  transports,
  Logger as WinstonLogger,
} from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

const { combine, timestamp, label, printf, prettyPrint } = format;

interface ILogger {
  info(message: string): void;
  error(message: string): void;
  warn(message: string): void;
  debug?(message: string): void;
}

class Logger implements ILogger {
  private logger: WinstonLogger;

  constructor(
    logLabel: string,
    logLevel: string,
    logFilePath: string,
    maxFiles: string,
  ) {
    this.logger = createLogger({
      level: logLevel,
      format: combine(
        label({ label: logLabel }),
        timestamp(),
        Logger.customFormat,
        prettyPrint(),
      ),
      transports: [
        new transports.Console({
          format: combine(
            Logger.customFormat,
            format.colorize({ all: true })
          ),
        }),
        new DailyRotateFile({
          filename: path.join(
            process.cwd(),
            'logs',
            'winston',
            logFilePath,
            `server-%DATE%-${logLevel}.log`,
          ),
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles,
        }),
      ],
    });
  }

  static customFormat = printf(({ level, message, label, timestamp }) => {
    const date = new Date(timestamp as string);
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return `${date.toDateString()},${hour}:${minute}:${second} [${label}] ${level}: ${message}`;
  });

  info(message: string): void {
    this.logger.info(message);
  }

  error(message: string): void {
    this.logger.error(message);
  }

  warn(message: string): void {
    this.logger.warn(message);
  }

  debug?(message: string): void {
    this.logger.debug?.(message);
  }
}

// Singleton instances
export const logger = new Logger('APP', 'info', 'success', '14d');
export const errorLogger = new Logger('ERROR', 'error', 'errors', '14d');
