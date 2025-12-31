const express = require('express');
const router = express.Router();
const auth = require('../middleware/jwt-auth');
const { v4: uuidv4 } = require('uuid');
const { WEEK } = require('time-constants');

// JWT autentifikatsiya middleware
router.use(auth);

// Locale va session-id middleware
router.use((req, res, next) => {
  req.locale = req.headers['user-locale'] || 'uz';

  const sessionId = req.cookies['session-id'] || uuidv4();
  res.cookie('session-id', sessionId, {
    maxAge: WEEK,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  });

  req.sessionId = sessionId;

  next();
});

// API routelar
router.use('/api', require('./api'));

module.exports = router;
