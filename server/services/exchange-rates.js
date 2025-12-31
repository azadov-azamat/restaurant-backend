const redisClient = require('./redis');
const logger = require('../utils/logger');

const RATE_URL = 'https://cbu.uz/uz/arkhiv-kursov-valyut/json/';
const CACHE_TTL = 5 * 60; // 5 minutes in seconds
const FETCH_TIMEOUT = 5000; // 5 seconds
const REDIS_KEY = 'exchange-rates';

async function fetchRates() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const response = await fetch(RATE_URL, { signal: controller.signal });
    clearTimeout(timer);
    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rates: ${response.status}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

async function getExchangeRates() {
  try {
    const cached = await redisClient.get(REDIS_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (err) {
    logger.error('Redis error fetching cached rates:', err);
  }

  let rates;
  try {
    rates = await fetchRates();
  } catch (err) {
    logger.error('Failed to fetch exchange rates:', err);
    throw err;
  }

  try {
    await redisClient.set(REDIS_KEY, JSON.stringify(rates), 'EX', CACHE_TTL);
  } catch (err) {
    logger.error('Redis error caching rates:', err);
  }

  return rates;
}

module.exports = { getExchangeRates };
