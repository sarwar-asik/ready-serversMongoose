import { createLogger, format, transports } from 'winston'
const { combine, timestamp, label, printf, prettyPrint } = format
import DailyRotateFile from 'winston-daily-rotate-file'

import path from 'path'

// custom log formate //

const myFormat = printf(({ level, message, label, timestamp }) => {
  const date = new Date(timestamp as string)
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${date.toDateString()},${hour}:${minute}:${second} [${label}] ${level}: ${message}`
})

const logger = createLogger({
  format: combine(
    label({ label: 'right meow!' }),
    timestamp(),
    myFormat,
    prettyPrint()
  ),
  transports: [
    new transports.Console(),

    new DailyRotateFile({
      filename: path.join(
        process.cwd(),
        'logs',
        'winston',
        'success',
        'server-%DATE%-success.log'
      ),
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '1d',
    }),
  ],
})

const errorLogger = createLogger({
  level: 'error',
  //   format: format.json(),
  format: combine(
    label({ label: 'right meow!' }),
    timestamp(),
    myFormat,
    prettyPrint()
  ),
  transports: [
    new transports.Console(),

    new DailyRotateFile({
      filename: path.join(
        process.cwd(),
        'logs',
        'winston',
        'errors',
        'server-error-%DATE%-error.log'
      ),
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '5d',
    }),
  ],
})

logger.add(
  new transports.Console({
    format: format.simple(),
  })
)

export { logger, errorLogger }
