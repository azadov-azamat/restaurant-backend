const express = require('express');
const router = express.Router();

const route = require('../../utils/async-handler');
const ensureAuth = require('../../middleware/ensure-auth');
const parseOps = require('../../utils/qps')();
const pagination = require('../../utils/pagination');

const { Order, OrderItem, MenuItem, Room, Staff } = require('../../../db/models');
const orderEventEmitter = require('../../utils/emitter');

// ------------------------------------------
// CREATE ORDER
// ------------------------------------------
router.post(
  '/',
  ensureAuth(['WAITER']),
  route(async (req, res) => {
    const { tableId, roomId, items } = req.body;
    const staffId = req.user.id;

    const order = await Order.create({
      tableId,
      roomId,
      staffId,
      status: 'OPEN',
    });

    // Agar items ham kelgan bo‘lsa, ularni create qiling
    if (Array.isArray(items) && items.length > 0) {
      await OrderItem.bulkCreate(
        items.map(i => ({
          orderId: order.id,
          menuItemId: i.menuItemId,
          quantity: i.quantity ?? 1,
          notes: i.notes ?? null,
          status: i.status ?? 'PENDING',
          requiresKitchen: i.requiresKitchen ?? true,
        }))
      );
    }

    // Endi include bilan qayta o‘qib qaytaramiz
    const orderWithIncludes = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'items' }],
    });

    res.status(201).send({ data: orderWithIncludes });
  })
);

// SSE endpoint - orders/events
router.get('/events', ensureAuth(), (req, res) => {
  console.log('[SSE] Client connected for order events');

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Nginx uchun

  // CORS (agar kerak bo'lsa)
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Initial connection message
  res.write('data: {"type":"connected","message":"SSE connection established"}\n\n');

  // Order change event listener
  const orderChangeListener = data => {
    console.log('[SSE] Sending order change:', data);
    res.write(`data: ${JSON.stringify({ type: 'orderChange', ...data })}\n\n`);
  };

  // Order item change event listener
  const orderItemChangeListener = data => {
    console.log('[SSE] Sending order item change:', data);
    res.write(`data: ${JSON.stringify({ type: 'orderItemChange', ...data })}\n\n`);
  };

  // Subscribe to events
  orderEventEmitter.on('orderChange', orderChangeListener);
  orderEventEmitter.on('orderItemChange', orderItemChangeListener);

  // Heartbeat (har 30 soniyada)
  const heartbeatInterval = setInterval(() => {
    res.write('data: {"type":"heartbeat"}\n\n');
  }, 30000);

  // Client disconnect bo'lganda cleanup
  req.on('close', () => {
    console.log('[SSE] Client disconnected');
    orderEventEmitter.off('orderChange', orderChangeListener);
    orderEventEmitter.off('orderItemChange', orderItemChangeListener);
    clearInterval(heartbeatInterval);
    res.end();
  });
});
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
