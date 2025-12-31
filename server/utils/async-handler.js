const redisClient = require('../services/redis');
const crypto = require('crypto');

module.exports = fn => {
  return async function (req, res, next) {
    const method = req.method.toUpperCase();
    const key = req.headers['idempotency-key'];

    if (['POST', 'PUT', 'DELETE'].includes(method)) {
      if (!key) {
        return res.status(400).json({ error: 'Idempotency-Key header is required' });
      }

      const redisKey = `idempotency:${key}`;

      try {
        const cached = await redisClient.get(redisKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          return res.status(parsed.statusCode || 200).json(parsed.body);
        }

        // Intercept res.json
        const originalJson = res.json.bind(res);
        res.json = async body => {
          // Save response in Redis with TTL (optional: 10 minutes = 600 sec)
          const cacheValue = JSON.stringify({
            statusCode: res.statusCode || 200,
            body,
          });

          await redisClient.set(redisKey, cacheValue, 'EX', 6);
          return originalJson(body);
        };
      } catch (err) {
        console.error('Redis error (idempotency):', err);
        // continue anyway
      }
    }

    // Call main handler
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
