const logger = require('./logger');

const handleApiError = (error, res) => {
  logger.error(error);
  res.status(error.status || 500).json({ error: error.data || 'Internal Server Error' });
};

module.exports = {
  handleApiError,
};
