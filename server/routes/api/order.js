const express = require('express');
const router = express.Router();

const route = require('../../utils/async-handler');
const ensureAuth = require('../../middleware/ensure-auth');
const parseOps = require('../../utils/qps')();
const pagination = require('../../utils/pagination');

const { Order, OrderItem, MenuItem, Room, Staff } = require('../../../db/models');

// ------------------------------------------
// CREATE ORDER
// ------------------------------------------
router.post(
  '/',
  ensureAuth(['WAITER']),
  route(async (req, res) => {
    const { tableId, roomId } = req.body;
    const staffId = req.user.id;

    const order = await Order.create({
      tableId,
      roomId,
      staffId,
      status: 'OPEN',
    });

    res.status(201).send({ data: order });
  })
);

// ------------------------------------------
// GET ALL ORDERS
// ------------------------------------------
router.get(
  '/',
  ensureAuth(),
  route(async (req, res) => {
    const query = parseOps(req.query);

    query.include = [
      {
        model: Room,
        as: 'room',
        attributes: ['id', 'name'],
      },
      {
        model: Staff,
        as: 'staff',
        attributes: ['id', 'fullName', 'role'],
      },
      {
        model: OrderItem,
        as: 'items',
        include: [
          {
            model: MenuItem,
            as: 'menuItem',
          },
        ],
      },
    ];
    query.order = [['createdAt', 'DESC']];

    // WAITER can only see their own orders
    if (req.user.role === 'WAITER') {
      query.where = {
        ...query.where,
        staffId: req.user.id,
      };
    }

    const { rows: orders, count } = await Order.findAndCountAll(query);

    res.send({
      data: orders,
      meta: pagination(query.limit, query.offset, count),
    });
  })
);

// ------------------------------------------
// GET ORDERS BY TABLE
// ------------------------------------------
router.get(
  '/table/:tableId',
  ensureAuth(),
  route(async (req, res) => {
    const orders = await Order.findAll({
      where: {
        tableId: req.params.tableId,
        status: { [require('sequelize').Op.ne]: 'PAID' },
      },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: MenuItem, as: 'menuItem' }],
        },
        {
          model: Staff,
          as: 'staff',
          attributes: ['id', 'fullName'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.send({ data: orders });
  })
);

// ------------------------------------------
// GET ONE ORDER BY ID
// ------------------------------------------
router.get(
  '/:id',
  ensureAuth(),
  route(async (req, res) => {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: Room, as: 'room' },
        { model: Staff, as: 'staff', attributes: ['id', 'fullName', 'role'] },
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: MenuItem, as: 'menuItem' }],
        },
      ],
    });

    if (!order) {
      return res.status(404).send({ message: 'Order not found' });
    }

    // WAITER can only see their own orders
    if (req.user.role === 'WAITER' && order.staffId !== req.user.id) {
      return res.status(403).send({ message: 'Access denied' });
    }

    res.send({ data: order });
  })
);

// ------------------------------------------
// UPDATE ORDER STATUS (PATCH)
// ------------------------------------------
router.patch(
  '/:id/status',
  ensureAuth(),
  route(async (req, res) => {
    const { status } = req.body;

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).send({ message: 'Order not found' });
    }

    // WAITER can only update their own orders
    if (req.user.role === 'WAITER' && order.staffId !== req.user.id) {
      return res.status(403).send({ message: 'Access denied' });
    }

    await order.update({ status });

    res.send({ data: order });
  })
);

// ------------------------------------------
// DELETE ORDER
// ------------------------------------------
router.delete(
  '/:id',
  ensureAuth(['ADMIN', 'MANAGER']),
  route(async (req, res) => {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).send({ message: 'Order not found' });
    }

    // Items will be deleted automatically by CASCADE
    await order.destroy();

    res.send({ message: 'Order deleted successfully' });
  })
);

module.exports = router;
