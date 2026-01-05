const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/categories', require('./category'));
router.use('/floors', require('./floor'));
router.use('/menu-items', require('./menu-items'));
router.use('/rooms', require('./room'));
router.use('/room-elements', require('./room-elements'));
router.use('/staff', require('./staff'));
router.use('/orders', require('./order'));
router.use('/order-items', require('./order-items'));
router.use('/reservations', require('./reservation'));
router.use('/media', require('./media'));

module.exports = router;
