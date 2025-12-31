const Redis = require('ioredis');
const logger = require('../utils/logger');

let client = new Redis(process.env.REDIS_URL);

client.on('connect', () => {
  const address = `${client.options.host}:${client.options.port}`;
  logger.info(`Connected to Redis at: ${address}`);
});

module.exports = client;
