const express = require('express');
const router = express.Router();

const route = require('../../utils/async-handler');
const ensureAuth = require('../../middleware/ensure-auth');
const parseOps = require('../../utils/qps')();
const pagination = require('../../utils/pagination');

const { Reservation, Room } = require('../../../db/models');

// ------------------------------------------
// CREATE RESERVATION
// ------------------------------------------
router.post(
  '/',
  ensureAuth(['ADMIN', 'MANAGER', 'WAITER']),
  route(async (req, res) => {
    const { tableId, roomId, customerName, customerPhone, partySize, startTime, endTime, notes } =
      req.body;

    const room = await Room.findByPk(roomId);

    if (!room) {
      return res.status(404).send({ message: 'Room not found' });
    }

    // Check for overlapping reservations
    const { Op } = require('sequelize');
    const overlapping = await Reservation.findOne({
      where: {
        tableId,
        [Op.or]: [
          {
            startTime: {
              [Op.between]: [startTime, endTime],
            },
          },
          {
            endTime: {
              [Op.between]: [startTime, endTime],
            },
          },
          {
            [Op.and]: [{ startTime: { [Op.lte]: startTime } }, { endTime: { [Op.gte]: endTime } }],
          },
        ],
      },
    });

    if (overlapping) {
      return res.status(400).send({ message: 'Table is already reserved for this time' });
    }

    const reservation = await Reservation.create({
      tableId,
      roomId,
      customerName,
      customerPhone,
      partySize,
      startTime,
      endTime,
      notes,
    });

    res.status(201).send({ data: reservation });
  })
);

// ------------------------------------------
// GET ALL RESERVATIONS
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
    ];
    query.order = [['startTime', 'ASC']];

    const { rows: reservations, count } = await Reservation.findAndCountAll(query);

    res.send({
      data: reservations,
      meta: pagination(query.limit, query.offset, count),
    });
  })
);

// ------------------------------------------
// GET RESERVATIONS BY TABLE
// ------------------------------------------
router.get(
  '/table/:tableId',
  ensureAuth(),
  route(async (req, res) => {
    const now = new Date();

    const reservations = await Reservation.findAll({
      where: {
        tableId: req.params.tableId,
        endTime: { [require('sequelize').Op.gte]: now },
      },
      order: [['startTime', 'ASC']],
    });

    res.send({ data: reservations });
  })
);

// ------------------------------------------
// GET ONE RESERVATION BY ID
// ------------------------------------------
router.get(
  '/:id',
  ensureAuth(),
  route(async (req, res) => {
    const reservation = await Reservation.findByPk(req.params.id, {
      include: [{ model: Room, as: 'room' }],
    });

    if (!reservation) {
      return res.status(404).send({ message: 'Reservation not found' });
    }

    res.send({ data: reservation });
  })
);

// ------------------------------------------
// UPDATE RESERVATION (PATCH)
// ------------------------------------------
router.patch(
  '/:id',
  ensureAuth(['ADMIN', 'MANAGER', 'WAITER']),
  route(async (req, res) => {
    const reservation = await Reservation.findByPk(req.params.id);

    if (!reservation) {
      return res.status(404).send({ message: 'Reservation not found' });
    }

    // If updating time, check for overlaps
    if (req.body.startTime || req.body.endTime) {
      const startTime = req.body.startTime || reservation.startTime;
      const endTime = req.body.endTime || reservation.endTime;

      const { Op } = require('sequelize');
      const overlapping = await Reservation.findOne({
        where: {
          id: { [Op.ne]: reservation.id },
          tableId: reservation.tableId,
          [Op.or]: [
            {
              startTime: {
                [Op.between]: [startTime, endTime],
              },
            },
            {
              endTime: {
                [Op.between]: [startTime, endTime],
              },
            },
            {
              [Op.and]: [
                { startTime: { [Op.lte]: startTime } },
                { endTime: { [Op.gte]: endTime } },
              ],
            },
          ],
        },
      });

      if (overlapping) {
        return res.status(400).send({ message: 'Table is already reserved for this time' });
      }
    }

    await reservation.update(req.body);

    res.send({ data: reservation });
  })
);

// ------------------------------------------
// DELETE RESERVATION
// ------------------------------------------
router.delete(
  '/:id',
  ensureAuth(['ADMIN', 'MANAGER', 'WAITER']),
  route(async (req, res) => {
    const reservation = await Reservation.findByPk(req.params.id);

    if (!reservation) {
      return res.status(404).send({ message: 'Reservation not found' });
    }

    await reservation.destroy();

    res.send({ message: 'Reservation deleted successfully' });
  })
);

module.exports = router;
