/**
 *
 *
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 */
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

  console.log(`Request data: ${req.method} -- ${req.url} ${requestTime}`);

  next();
}
