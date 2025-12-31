const express = require("express")
const router = express.Router()

const route = require('../../utils/async-handler');
const ensureAuth = require('../../middleware/ensure-auth');

const { OrderItem, Order, MenuItem } = require('../../../db/models');

// ------------------------------------------
// ADD ITEM TO ORDER
// ------------------------------------------
router.post(
  "/",
  ensureAuth(["WAITER"]),
  route(async (req, res) => {
    const { orderId, menuItemId, quantity, notes } = req.body

    const order = await Order.findByPk(orderId)

    if (!order) {
      return res.status(404).send({ message: "Order not found" })
    }

    // Check if waiter owns this order
    if (order.staffId !== req.user.id) {
      return res.status(403).send({ message: "Access denied" })
    }

    const menuItem = await MenuItem.findByPk(menuItemId)

    if (!menuItem) {
      return res.status(404).send({ message: "Menu item not found" })
    }

    const requiresKitchen = menuItem.type === "KITCHEN_MADE"

    const orderItem = await OrderItem.create({
      orderId,
      menuItemId,
      quantity,
      notes,
      status: "PENDING",
      requiresKitchen,
    })

    res.status(201).send({ data: orderItem })
  }),
)

// ------------------------------------------
// GET ALL ITEMS FOR AN ORDER
// ------------------------------------------
router.get(
  "/order/:orderId",
  ensureAuth(),
  route(async (req, res) => {
    const orderItems = await OrderItem.findAll({
      where: { orderId: req.params.orderId },
      include: [
        {
          model: MenuItem,
          as: "menuItem",
        },
      ],
      order: [["createdAt", "ASC"]],
    })

    res.send({ data: orderItems })
  }),
)

// ------------------------------------------
// GET ITEMS FOR KITCHEN
// ------------------------------------------
router.get(
  "/kitchen/pending",
  ensureAuth(["CHEF", "ADMIN", "MANAGER"]),
  route(async (req, res) => {
    const orderItems = await OrderItem.findAll({
      where: {
        requiresKitchen: true,
        status: ["SENT", "PREPARING"],
      },
      include: [
        {
          model: MenuItem,
          as: "menuItem",
        },
        {
          model: Order,
          as: "order",
          include: [
            {
              model: require("../models").Room,
              as: "room",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
      order: [["createdAt", "ASC"]],
    })

    res.send({ data: orderItems })
  }),
)

// ------------------------------------------
// UPDATE ORDER ITEM STATUS
// ------------------------------------------
router.patch(
  "/:id/status",
  ensureAuth(),
  route(async (req, res) => {
    const { status } = req.body

    const orderItem = await OrderItem.findByPk(req.params.id, {
      include: [{ model: Order, as: "order" }],
    })

    if (!orderItem) {
      return res.status(404).send({ message: "Order item not found" })
    }

    // WAITER can update their own order items
    // CHEF can update kitchen items
    if (req.user.role === "WAITER" && orderItem.order.staffId !== req.user.id) {
      return res.status(403).send({ message: "Access denied" })
    }

    await orderItem.update({ status })

    res.send({ data: orderItem })
  }),
)

// ------------------------------------------
// UPDATE ORDER ITEM
// ------------------------------------------
router.patch(
  "/:id",
  ensureAuth(["WAITER"]),
  route(async (req, res) => {
    const orderItem = await OrderItem.findByPk(req.params.id, {
      include: [{ model: Order, as: "order" }],
    })

    if (!orderItem) {
      return res.status(404).send({ message: "Order item not found" })
    }

    // Check if waiter owns this order
    if (orderItem.order.staffId !== req.user.id) {
      return res.status(403).send({ message: "Access denied" })
    }

    await orderItem.update(req.body)

    res.send({ data: orderItem })
  }),
)

// ------------------------------------------
// DELETE ORDER ITEM
// ------------------------------------------
router.delete(
  "/:id",
  ensureAuth(["WAITER"]),
  route(async (req, res) => {
    const orderItem = await OrderItem.findByPk(req.params.id, {
      include: [{ model: Order, as: "order" }],
    })

    if (!orderItem) {
      return res.status(404).send({ message: "Order item not found" })
    }

    // Check if waiter owns this order
    if (orderItem.order.staffId !== req.user.id) {
      return res.status(403).send({ message: "Access denied" })
    }

    await orderItem.destroy()

    res.send({ message: "Order item deleted successfully" })
  }),
)

module.exports = router
