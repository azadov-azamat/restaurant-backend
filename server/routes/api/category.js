const express = require('express');
const router = express.Router();

const route = require('../../utils/async-handler');
const ensureAuth = require('../../middleware/ensure-auth');
const parseOps = require('../../utils/qps')();
const pagination = require('../../utils/pagination');

const { Category, MenuItem } = require('../../../db/models');

// ------------------------------------------
// CREATE CATEGORY
// ------------------------------------------
router.post(
  '/',
  ensureAuth(['ADMIN', 'MANAGER']),
  route(async (req, res) => {
    const { name, description } = req.body;

    const category = await Category.create({ name, description });

    res.status(201).send({ data: category });
  })
);

// ------------------------------------------
// GET ALL CATEGORIES
// ------------------------------------------
router.get(
  '/',
  ensureAuth(),
  route(async (req, res) => {
    const query = parseOps(req.query);

    query.include = [
      {
        model: MenuItem,
        as: 'menuItems',
        attributes: ['id', 'name', 'price'],
      },
    ];
    query.order = [['createdAt', 'ASC']];

    const { rows: categories, count } = await Category.findAndCountAll(query);

    res.send({
      data: categories,
      meta: pagination(query.limit, query.offset, count),
    });
  })
);

// ------------------------------------------
// GET ONE CATEGORY BY ID
// ------------------------------------------
router.get(
  '/:id',
  ensureAuth(),
  route(async (req, res) => {
    const category = await Category.findByPk(req.params.id, {
      include: [
        {
          model: MenuItem,
          as: 'menuItems',
        },
      ],
    });

    if (!category) {
      return res.status(404).send({ message: 'Category not found' });
    }

    res.send({ data: category });
  })
);

// ------------------------------------------
// UPDATE CATEGORY (PATCH)
// ------------------------------------------
router.patch(
  '/:id',
  ensureAuth(['ADMIN', 'MANAGER']),
  route(async (req, res) => {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).send({ message: 'Category not found' });
    }

    await category.update(req.body);

    res.send({ data: category });
  })
);

// ------------------------------------------
// DELETE CATEGORY
// ------------------------------------------
router.delete(
  '/:id',
  ensureAuth(['ADMIN', 'MANAGER']),
  route(async (req, res) => {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).send({ message: 'Category not found' });
    }

    // Check if category has menu items
    const itemCount = await MenuItem.count({ where: { categoryId: category.id } });

    if (itemCount > 0) {
      return res.status(400).send({ message: 'Cannot delete category with existing menu items' });
    }

    await category.destroy();

    res.send({ message: 'Category deleted successfully' });
  })
);

module.exports = router;
