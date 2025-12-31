const util = require('util');
const isProduction = process.env.NODE_ENV === 'production';
const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logger.error('CORS error:', err);
  if (req.path.startsWith('/api') && isProduction) {
    let errMessages = [
      '[!] API ERROR:',
      util.format('    %s %s', req.method, req.originalUrl),
      'Headers: ',
    ];

    for (let headerKey in req.headers) {
      let headerVal = req.headers[headerKey];
      errMessages.push(util.format('    %s: %s', headerKey, headerVal));
    }
    errMessages.push(util.format(err));
    // errMessages.push(err.stack || err.message || String(err));
    logger.error(errMessages.join('\n'));
  } else {
    logger.error(err);
    logger.error(new Error(err.message));
  }

  if (isProduction) {
    res.sendStatus(500);
  } else {
    res.status(500).send({ error: util.format(err) });
    // res.status(500).send({ error: err.stack || err.message || String(err) });
  }
}

process.on('unhandledRejection', function (reason, promise) {
  logger.error(reason, promise);
});

module.exports = errorHandler;
