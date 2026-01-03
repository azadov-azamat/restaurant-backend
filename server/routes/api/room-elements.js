const express = require('express');
const router = express.Router();

const route = require('../../utils/async-handler');
const ensureAuth = require('../../middleware/ensure-auth');

const { RoomElement, Room } = require('../../../db/models');

// ------------------------------------------
// CREATE ROOM ELEMENT
// ------------------------------------------
router.post(
  '/',
  ensureAuth(['ADMIN', 'MANAGER']),
  route(async (req, res) => {
    const { roomId, type, ...elementData } = req.body;

    const room = await Room.findByPk(roomId);

    if (!room) {
      return res.status(404).send({ message: 'Room not found' });
    }

    const element = await RoomElement.create({
      roomId,
      type,
      ...elementData,
    });

    res.status(201).send({ data: element });
  })
);

// ------------------------------------------
// GET ALL ELEMENTS FOR A ROOM
// ------------------------------------------
router.get(
  '/room/:roomId',
  ensureAuth(),
  route(async (req, res) => {
    const elements = await RoomElement.findAll({
      where: { roomId: req.params.roomId },
      order: [['createdAt', 'ASC']],
    });

    res.send({ data: elements });
  })
);

// ------------------------------------------
// GET ONE ELEMENT BY ID
// ------------------------------------------
router.get(
  '/:id',
  ensureAuth(),
  route(async (req, res) => {
    const element = await RoomElement.findByPk(req.params.id);

    if (!element) {
      return res.status(404).send({ message: 'Element not found' });
    }

    res.send({ data: element });
  })
);

// ------------------------------------------
// UPDATE ELEMENT (PATCH)
// ------------------------------------------
router.patch(
  '/:id',
  ensureAuth(['ADMIN', 'MANAGER']),
  route(async (req, res) => {
    const element = await RoomElement.findByPk(req.params.id);

    if (!element) {
      return res.status(404).send({ message: 'Element not found' });
    }

    await element.update(req.body);

    res.send({ data: element });
  })
);

// ------------------------------------------
// DELETE ELEMENT
// ------------------------------------------
router.delete(
  '/:id',
  ensureAuth(['ADMIN', 'MANAGER']),
  route(async (req, res) => {
    const element = await RoomElement.findByPk(req.params.id);

    if (!element) {
      return res.status(404).send({ message: 'Element not found' });
    }

    await element.destroy();

    res.send({ message: 'Element deleted successfully' });
  })
);

module.exports = router;
