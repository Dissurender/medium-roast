import { logger } from './winston.js';

export function logErr(err) {
  logger.error(err.message);
  logger.error(err.stack);
}

export function errMiddleware(err, req, res, next) {
  logErr(err);
  next(err);
}

export function errResponse(err, req, res) {
  res.status(err.status || 500).send(err.message);
}
