import { logger } from '../utils/winston';

export function requestLogger(req, res, next) {
  const time = new Date(Date.now());
  const [month, day, year, hour, minute] = [
    time.getMonth(),
    time.getDay(),
    time.getFullYear(),
    time.getHours(),
    time.getMinutes(),
  ];

  const requestTime = `${month}-${day}-${year} (${hour}:${minute})`;

  logger.info(`Request data: ${req.method} -- ${req.url} ${requestTime}`);

  next();
}
