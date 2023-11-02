import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
const { combine, timestamp, colorize, printf } = format;

const logFolder = 'logs';

export const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    colorize(),
    printf(({ level, timestamp, message }) => {
      return `${level}: ${timestamp} -- ${message}`;
    })
  ),
  transports: [
    new transports.Console(),

    new transports.DailyRotateFile({
      level: 'info',
      filename: `${logFolder}/%DATE%-info.log`,
      datePattern: 'YYYY-MM-DD',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        printf(({ timestamp, message }) => {
          return `${timestamp} -- ${message}`;
        })
      ),
      zippedArchive: true,
      maxSize: '20m',
    }),

    new transports.DailyRotateFile({
      level: 'error',
      filename: `${logFolder}/%DATE%-error.log`,
      datePattern: 'YYYY-MM-DD',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        printf(({ timestamp, message }) => {
          return `$${timestamp} -- ${message}`;
        })
      ),
    }),
  ],
});
