const express = require("express")
const router = express.Router()

const route = require('../../utils/async-handler');
const ensureAuth = require('../../middleware/ensure-auth');
const parseOps = require('../../utils/qps')();
const pagination = require('../../utils/pagination');

const { Room, Floor, RoomElement } = require('../../../db/models');

// ------------------------------------------
// CREATE ROOM
// ------------------------------------------
router.post(
  "/",
  ensureAuth(["ADMIN", "MANAGER"]),
  route(async (req, res) => {
    const { name, floorId, width, height } = req.body

    const floor = await Floor.findByPk(floorId)

    if (!floor) {
      return res.status(404).send({ message: "Floor not found" })
    }

    const room = await Room.create({
      name,
      floorId,
      width,
      height,
    })

    res.status(201).send({ data: room })
  }),
)

// ------------------------------------------
// GET ALL ROOMS
// ------------------------------------------
router.get(
  "/",
  ensureAuth(),
  route(async (req, res) => {
    const query = parseOps(req.query)

    query.include = [
      {
        model: Floor,
        as: "floor",
        attributes: ["id", "name"],
      },
      {
        model: RoomElement,
        as: "elements",
      },
    ]
    query.order = [["createdAt", "DESC"]]

    const { rows: rooms, count } = await Room.findAndCountAll(query)

    res.send({
      data: rooms,
      meta: pagination(query.limit, query.offset, count),
    })
  }),
)

// ------------------------------------------
// GET ONE ROOM BY ID
// ------------------------------------------
router.get(
  "/:id",
  ensureAuth(),
  route(async (req, res) => {
    const room = await Room.findByPk(req.params.id, {
      include: [
        {
          model: Floor,
          as: "floor",
        },
        {
          model: RoomElement,
          as: "elements",
        },
      ],
    })

    if (!room) {
      return res.status(404).send({ message: "Room not found" })
    }

    res.send({ data: room })
  }),
)

// ------------------------------------------
// UPDATE ROOM (PATCH)
// ------------------------------------------
router.patch(
  "/:id",
  ensureAuth(["ADMIN", "MANAGER"]),
  route(async (req, res) => {
    const room = await Room.findByPk(req.params.id)

    if (!room) {
      return res.status(404).send({ message: "Room not found" })
    }

    await room.update(req.body)

    res.send({ data: room })
  }),
)

// ------------------------------------------
// DELETE ROOM
// ------------------------------------------
router.delete(
  "/:id",
  ensureAuth(["ADMIN", "MANAGER"]),
  route(async (req, res) => {
    const room = await Room.findByPk(req.params.id)

    if (!room) {
      return res.status(404).send({ message: "Room not found" })
    }

    // Elements will be deleted automatically by CASCADE
    await room.destroy()

    res.send({ message: "Room deleted successfully" })
  }),
)

// ------------------------------------------
// UPDATE ROOM ELEMENTS (PATCH)
// ------------------------------------------
router.patch(
  "/:id/elements",
  ensureAuth(["ADMIN", "MANAGER"]),
  route(async (req, res) => {
    const room = await Room.findByPk(req.params.id)

    if (!room) {
      return res.status(404).send({ message: "Room not found" })
    }

    const { elements } = req.body

    // Delete all existing elements
    await RoomElement.destroy({ where: { roomId: room.id } })

    // Create new elements
    const newElements = await RoomElement.bulkCreate(
      elements.map((el) => ({
        ...el,
        roomId: room.id,
      })),
    )

    res.send({ data: newElements })
  }),
)

module.exports = router
