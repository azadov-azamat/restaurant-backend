const express = require('express');
const router = express.Router();

const route = require('../../utils/async-handler');
const ensureAuth = require('../../middleware/ensure-auth');
const parseOps = require('../../utils/qps')();
const pagination = require('../../utils/pagination');

const { Floor, Room } = require('../../../db/models');

// ------------------------------------------
// CREATE FLOOR
// ------------------------------------------
router.post(
  '/',
  ensureAuth(['ADMIN', 'MANAGER']),
  route(async (req, res) => {
    const { name } = req.body;

    const floor = await Floor.create({ name });

    res.status(201).send({ data: floor });
  })
);

// ------------------------------------------
// GET ALL FLOORS
// ------------------------------------------
router.get(
  '/',
  ensureAuth(),
  route(async (req, res) => {
    const query = parseOps(req.query);

    query.include = [
      {
        model: Room,
        as: 'rooms',
        attributes: ['id', 'name'],
      },
    ];
    query.order = [['createdAt', 'ASC']];

    const { rows: floors, count } = await Floor.findAndCountAll(query);

    res.send({
      data: floors,
      meta: pagination(query.limit, query.offset, count),
    });
  })
);

// ------------------------------------------
// GET ONE FLOOR BY ID
// ------------------------------------------
router.get(
  '/:id',
  ensureAuth(),
  route(async (req, res) => {
    const floor = await Floor.findByPk(req.params.id, {
      include: [
        {
          model: Room,
          as: 'rooms',
        },
      ],
    });

    if (!floor) {
      return res.status(404).send({ message: 'Floor not found' });
    }

    res.send({ data: floor });
  })
);

// ------------------------------------------
// UPDATE FLOOR (PATCH)
// ------------------------------------------
router.patch(
  '/:id',
  ensureAuth(['ADMIN', 'MANAGER']),
  route(async (req, res) => {
    const floor = await Floor.findByPk(req.params.id);

    if (!floor) {
      return res.status(404).send({ message: 'Floor not found' });
    }

    await floor.update(req.body);

    res.send({ data: floor });
  })
);

// ------------------------------------------
// DELETE FLOOR
// ------------------------------------------
router.delete(
  '/:id',
  ensureAuth(['ADMIN', 'MANAGER']),
  route(async (req, res) => {
    const floor = await Floor.findByPk(req.params.id);

    if (!floor) {
      return res.status(404).send({ message: 'Floor not found' });
    }

    // Check if floor has rooms
    const roomCount = await Room.count({ where: { floorId: floor.id } });

    if (roomCount > 0) {
      return res.status(400).send({ message: 'Cannot delete floor with existing rooms' });
    }

    await floor.destroy();

    res.send({ message: 'Floor deleted successfully' });
  })
);

module.exports = router;
