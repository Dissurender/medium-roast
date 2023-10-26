import { createLogger, format, transports } from 'winston';
const { combine, timestamp, colorize, printf } = format;

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
    new transports.File({
      filename: 'logs.log',
      level: 'info',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        printf(({ timestamp, message }) => {
          return `${timestamp} -- ${message}`;
        })
      ),
    }),
    new transports.File({
      filename: 'errors.log',
      level: 'error',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        printf(({ timestamp, message }) => {
          return `$${timestamp} -- ${message}`;
        })
      ),
    }),
  ],
});
