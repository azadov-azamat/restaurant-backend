const express = require('express');
const router = express.Router();

const route = require('../../utils/async-handler');
const ensureAuth = require('../../middleware/ensure-auth');

const { OrderItem, Order, MenuItem, Room, Media } = require('../../../db/models');
const { computeOrderStatus } = require('../../services/general');
const orderEventEmitter = require('../../utils/emitter');
const Joi = require('joi');

// ------------------------------------------
// ADD ITEM TO ORDER
// ------------------------------------------
router.post(
  '/',
  ensureAuth(['WAITER']),
  route(async (req, res) => {
    const { orderId, menuItemId, quantity, notes } = req.body;

    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).send({ message: 'Order not found' });
    }

    // Check if waiter owns this order
    if (order.staffId !== req.user.id) {
      return res.status(403).send({ message: 'Access denied' });
    }

    const menuItem = await MenuItem.findByPk(menuItemId);

    if (!menuItem) {
      return res.status(404).send({ message: 'Menu item not found' });
    }

    const requiresKitchen = menuItem.type === 'KITCHEN_MADE';

    const orderItem = await OrderItem.create({
      orderId,
      menuItemId,
      quantity,
      notes,
      status: 'PENDING',
      requiresKitchen,
    });

    res.status(201).send({ data: orderItem });
  })
);

// POST /api/order-items/batch
// Body: { orderId: string, items: Array<{menuItemId, quantity, status, requiresKitchen}> }
router.post(
  '/batch',
  ensureAuth(),
  route(async (req, res) => {
    // Validation schema
    const schema = Joi.object({
      orderId: Joi.string().uuid().required(),
      items: Joi.array()
        .items(
          Joi.object({
            menuItemId: Joi.string().uuid().required(),
            quantity: Joi.number().integer().min(1).required(),
            status: Joi.string()
              .valid('PENDING', 'SENT', 'PREPARING', 'READY', 'DELIVERED')
              .default('PENDING'),
            requiresKitchen: Joi.boolean().default(true),
          })
        )
        .min(1)
        .required(),
    });

    // Validate request body
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const { orderId, items } = value;

    // Order mavjudligini tekshirish
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).send({ message: 'Order not found' });
    }

    // Menu items mavjudligini tekshirish
    const menuItemIds = items.map(item => item.menuItemId);
    const menuItems = await MenuItem.findAll({
      where: { id: menuItemIds },
    });

    if (menuItems.length !== menuItemIds.length) {
      return res.status(400).send({ message: 'Some menu items not found' });
    }

    // Batch create all order items
    const createdItems = await OrderItem.bulkCreate(
      items.map(item => ({
        orderId,
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        status: item.status || 'PENDING',
        requiresKitchen: item.requiresKitchen,
      }))
    );

    // Order status ni yangilash
    const allOrderItems = await OrderItem.findAll({
      where: { orderId },
      include: [
        {
          model: MenuItem,
          as: 'menuItem',
          include: [{ model: Media, as: 'media' }],
        },
      ],
    });

    const newOrderStatus = computeOrderStatus(allOrderItems);
    await order.update({ status: newOrderStatus });

    // Event emit qilish (real-time update uchun)
    orderEventEmitter.emitOrderChange(orderId, 'items_added', {
      items: createdItems,
      newStatus: newOrderStatus,
    });

    // Created items ni to'liq ma'lumot bilan qaytarish
    const responseItems = await OrderItem.findAll({
      where: { id: createdItems.map(item => item.id) },
      include: [
        {
          model: MenuItem,
          as: 'menuItem',
          include: [{ model: Media, as: 'media' }],
        },
      ],
    });

    res.status(201).send({
      data: responseItems,
      orderStatus: newOrderStatus,
    });
  })
);

// ============================================
// PATCH /api/order-items/bulk-status - Batch status update
// ============================================
router.patch(
  '/bulk-status',
  ensureAuth(),
  route(async (req, res) => {
    // Validation schema
    const schema = Joi.object({
      ids: Joi.array().items(Joi.string().uuid()).min(1).required(),
      status: Joi.string().valid('PENDING', 'SENT', 'PREPARING', 'READY', 'DELIVERED').required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const { ids, status } = value;

    // Items mavjudligini tekshirish
    const items = await OrderItem.findAll({ where: { id: ids } });
    if (items.length === 0) {
      return res.status(404).send({ message: 'Order items not found' });
    }

    // Bulk update
    await OrderItem.update({ status }, { where: { id: ids } });

    // Updated items ni olish
    const updatedItems = await OrderItem.findAll({
      where: { id: ids },
      include: [
        {
          model: MenuItem,
          as: 'menuItem',
          include: [{ model: Media, as: 'media' }],
        },
      ],
    });

    // Har bir order ni yangilash
    const affectedOrderIds = [...new Set(items.map(item => item.orderId))];
    const updatedOrders = [];

    for (const orderId of affectedOrderIds) {
      const order = await Order.findByPk(orderId);
      if (!order) continue;

      const allOrderItems = await OrderItem.findAll({ where: { orderId } });
      const newOrderStatus = computeOrderStatus(allOrderItems);

      await order.update({ status: newOrderStatus });
      updatedOrders.push({ orderId, status: newOrderStatus });

      // Event emit
      orderEventEmitter.emitOrderChange(orderId, 'status_changed', {
        newStatus: newOrderStatus,
        updatedItemIds: ids,
      });
    }

    res.send({
      data: updatedItems,
      affectedOrders: updatedOrders,
    });
  })
);

// ============================================
// DELETE /api/order-items/batch - Batch delete
// ============================================
router.delete(
  '/batch',
  ensureAuth(),
  route(async (req, res) => {
    const schema = Joi.object({
      ids: Joi.array().items(Joi.string().uuid()).min(1).required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const { ids } = value;

    // Items ni olish (order ID uchun)
    const items = await OrderItem.findAll({ where: { id: ids } });
    if (items.length === 0) {
      return res.status(404).send({ message: 'Order items not found' });
    }

    const affectedOrderIds = [...new Set(items.map(item => item.orderId))];

    // Delete
    await OrderItem.destroy({ where: { id: ids } });

    // Order status larini yangilash
    const updatedOrders = [];
    for (const orderId of affectedOrderIds) {
      const order = await Order.findByPk(orderId);
      if (!order) continue;

      const remainingItems = await OrderItem.findAll({ where: { orderId } });
      const newStatus = computeOrderStatus(remainingItems);

      await order.update({ status: newStatus });
      updatedOrders.push({ orderId, status: newStatus });

      // Event emit
      orderEventEmitter.emitOrderChange(orderId, 'items_removed', {
        removedItemIds: ids,
        newStatus,
      });
    }

    res.send({
      message: 'Order items deleted successfully',
      affectedOrders: updatedOrders,
    });
  })
);
// ------------------------------------------
// GET ALL ITEMS FOR AN ORDER
// ------------------------------------------
router.get(
  '/order/:orderId',
  ensureAuth(),
  route(async (req, res) => {
    const orderItems = await OrderItem.findAll({
      where: { orderId: req.params.orderId },
      include: [
        {
          model: MenuItem,
          as: 'menuItem',
        },
      ],
      order: [['createdAt', 'ASC']],
    });

    res.send({ data: orderItems });
  })
);

// ------------------------------------------
// GET ITEMS FOR KITCHEN
// ------------------------------------------
router.get(
  '/kitchen/pending',
  ensureAuth(['CHEF', 'ADMIN', 'MANAGER']),
  route(async (req, res) => {
    const orderItems = await OrderItem.findAll({
      where: {
        requiresKitchen: true,
        status: ['SENT', 'PREPARING'],
      },
      include: [
        {
          model: MenuItem,
          as: 'menuItem',
        },
        {
          model: Order,
          as: 'order',
          include: [
            {
              model: Room,
              as: 'room',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
      order: [['createdAt', 'ASC']],
    });

    res.send({ data: orderItems });
  })
);

// ------------------------------------------
// UPDATE ORDER ITEM STATUS
// ------------------------------------------
router.patch(
  '/:id/status',
  ensureAuth(),
  route(async (req, res) => {
    const { status } = req.body;

    const orderItem = await OrderItem.findByPk(req.params.id, {
      include: [{ model: Order, as: 'order' }],
    });

    if (!orderItem) {
      return res.status(404).send({ message: 'Order item not found' });
    }

    // WAITER can update their own order items
    // CHEF can update kitchen items
    if (req.user.role === 'WAITER' && orderItem.order.staffId !== req.user.id) {
      return res.status(403).send({ message: 'Access denied' });
    }

    await orderItem.update({ status });

    res.send({ data: orderItem });
  })
);

// ------------------------------------------
// UPDATE ORDER ITEM
// ------------------------------------------
router.patch(
  '/:id',
  ensureAuth(['WAITER']),
  route(async (req, res) => {
    const orderItem = await OrderItem.findByPk(req.params.id, {
      include: [{ model: Order, as: 'order' }],
    });

    if (!orderItem) {
      return res.status(404).send({ message: 'Order item not found' });
    }

    // Check if waiter owns this order
    if (orderItem.order.staffId !== req.user.id) {
      return res.status(403).send({ message: 'Access denied' });
    }

    await orderItem.update(req.body);

    res.send({ data: orderItem });
  })
);

// ------------------------------------------
// DELETE ORDER ITEM
// ------------------------------------------
router.delete(
  '/:id',
  ensureAuth(['WAITER']),
  route(async (req, res) => {
    const orderItem = await OrderItem.findByPk(req.params.id, {
      include: [{ model: Order, as: 'order' }],
    });

    if (!orderItem) {
      return res.status(404).send({ message: 'Order item not found' });
    }

    // Check if waiter owns this order
    if (orderItem.order.staffId !== req.user.id) {
      return res.status(403).send({ message: 'Access denied' });
    }

    await orderItem.destroy();

    res.send({ message: 'Order item deleted successfully' });
  })
);

module.exports = router;
