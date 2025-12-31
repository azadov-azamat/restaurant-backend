const { createLogger, format, transports } = require('winston');

const level = process.env.LOG_LEVEL || 'info';

const logger = createLogger({
  level,
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.colorize(),
    format.printf(({ level, message, timestamp, stack }) => {
      return `${timestamp} ${level}: ${stack || message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
});

module.exports = logger;
