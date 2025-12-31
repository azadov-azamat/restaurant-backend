const express = require("express")
const router = express.Router()

const route = require('../../utils/async-handler');
const ensureAuth = require('../../middleware/ensure-auth');
const parseOps = require('../../utils/qps')();
const pagination = require('../../utils/pagination');

const { MenuItem, Category } = require('../../../db/models');

// ------------------------------------------
// CREATE MENU ITEM
// ------------------------------------------
router.post(
  "/",
  ensureAuth(["ADMIN", "MANAGER"]),
  route(async (req, res) => {
    const { name, categoryId, price, image, description, type, quantity } = req.body

    const category = await Category.findByPk(categoryId)

    if (!category) {
      return res.status(404).send({ message: "Category not found" })
    }

    const menuItem = await MenuItem.create({
      name,
      categoryId,
      price,
      image,
      description,
      type,
      quantity,
    })

    res.status(201).send({ data: menuItem })
  }),
)

// ------------------------------------------
// GET ALL MENU ITEMS
// ------------------------------------------
router.get(
  "/",
  ensureAuth(),
  route(async (req, res) => {
    const query = parseOps(req.query)

    query.include = [
      {
        model: Category,
        as: "category",
        attributes: ["id", "name"],
      },
    ]
    query.order = [["createdAt", "DESC"]]

    const { rows: menuItems, count } = await MenuItem.findAndCountAll(query)

    res.send({
      data: menuItems,
      meta: pagination(query.limit, query.offset, count),
    })
  }),
)

// ------------------------------------------
// GET MENU ITEMS BY CATEGORY
// ------------------------------------------
router.get(
  "/category/:categoryId",
  ensureAuth(),
  route(async (req, res) => {
    const menuItems = await MenuItem.findAll({
      where: { categoryId: req.params.categoryId },
      order: [["name", "ASC"]],
    })

    res.send({ data: menuItems })
  }),
)

// ------------------------------------------
// GET ONE MENU ITEM BY ID
// ------------------------------------------
router.get(
  "/:id",
  ensureAuth(),
  route(async (req, res) => {
    const menuItem = await MenuItem.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          as: "category",
        },
      ],
    })

    if (!menuItem) {
      return res.status(404).send({ message: "Menu item not found" })
    }

    res.send({ data: menuItem })
  }),
)

// ------------------------------------------
// UPDATE MENU ITEM (PATCH)
// ------------------------------------------
router.patch(
  "/:id",
  ensureAuth(["ADMIN", "MANAGER"]),
  route(async (req, res) => {
    const menuItem = await MenuItem.findByPk(req.params.id)

    if (!menuItem) {
      return res.status(404).send({ message: "Menu item not found" })
    }

    await menuItem.update(req.body)

    res.send({ data: menuItem })
  }),
)

// ------------------------------------------
// DELETE MENU ITEM
// ------------------------------------------
router.delete(
  "/:id",
  ensureAuth(["ADMIN", "MANAGER"]),
  route(async (req, res) => {
    const menuItem = await MenuItem.findByPk(req.params.id)

    if (!menuItem) {
      return res.status(404).send({ message: "Menu item not found" })
    }

    await menuItem.destroy()

    res.send({ message: "Menu item deleted successfully" })
  }),
)

module.exports = router
