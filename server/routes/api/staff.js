const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const route = require('../../utils/async-handler');
const ensureAuth = require('../../middleware/ensure-auth');
const parseOps = require('../../utils/qps')();
const pagination = require('../../utils/pagination');

const { Staff, Media, sequelize } = require('../../../db/models');
const upload = require('../../middleware/upload');

// ------------------------------------------
// CREATE STAFF
// ------------------------------------------
router.post(
  '/',
  ensureAuth(),
  route(async (req, res) => {
    const staff = await sequelize.transaction(async t => {
      const created = await Staff.create(req.body, { transaction: t });

      // Agar siz hook ishlatmasangiz, shu yerda yaratib qo‘yasiz:
      if (!created.mediaId) {
        const media = await Media.create(
          { provider: 'local', ownerType: 'staff', ownerId: created.id },
          { transaction: t }
        );
        await created.update({ mediaId: media.id }, { transaction: t });
      }

      return created;
    });

    res.status(201).send({ data: staff });
  })
);

// UPLOAD STAFF PHOTO (media row’ni update qiladi)
router.post(
  '/:id/photo',
  ensureAuth(),
  upload.single('file'),
  route(async (req, res) => {
    const staff = await Staff.findByPk(req.params.id);
    if (!staff) return res.status(404).send({ message: 'Staff not found' });

    // media row bo‘lmasa yaratamiz
    let mediaId = staff.mediaId;
    if (!mediaId) {
      const media = await Media.create({
        provider: 'local',
        ownerType: 'staff',
        ownerId: staff.id,
      });
      mediaId = media.id;
      await staff.update({ mediaId });
    }

    const media = await Media.findByPk(mediaId);

    await media.update({
      path: req.file.path,
      filename: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      // xohlasangiz url ham set qiling (masalan CDN)
      // url: `/uploads/${req.file.filename}`,
    });

    res.send({ data: { staff, media } });
  })
);

// ------------------------------------------
// GET ALL STAFF
// ------------------------------------------
router.get(
  '/',
  ensureAuth(['ADMIN', 'MANAGER']),
  route(async (req, res) => {
    const query = parseOps(req.query);

    query.attributes = { exclude: ['password'] };
    query.order = [['createdAt', 'DESC']];
    query.include = [{ model: Media, as: 'media' }];

    // MANAGER can only see CHEF and WAITER
    if (req.user.role === 'MANAGER') {
      query.where = {
        ...query.where,
        role: ['CHEF', 'WAITER'],
      };
    }

    const { rows: staff, count } = await Staff.findAndCountAll(query);

    res.send({
      data: staff,
      meta: pagination(query.limit, query.offset, count),
    });
  })
);

// ------------------------------------------
// GET ONE STAFF BY ID
// ------------------------------------------
router.get(
  '/:id',
  ensureAuth(['ADMIN', 'MANAGER']),
  route(async (req, res) => {
    const staff = await Staff.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });

    if (!staff) {
      return res.status(404).send({ message: 'Staff not found' });
    }

    // MANAGER cannot view ADMIN or other MANAGER
    if (req.user.role === 'MANAGER' && ['ADMIN', 'MANAGER'].includes(staff.role)) {
      return res.status(403).send({ message: 'Access denied' });
    }

    res.send({ data: staff });
  })
);

// ------------------------------------------
// UPDATE STAFF (PATCH)
// ------------------------------------------
router.patch(
  '/:id',
  ensureAuth(['ADMIN', 'MANAGER']),
  route(async (req, res) => {
    const staff = await Staff.findByPk(req.params.id);

    if (!staff) {
      return res.status(404).send({ message: 'Staff not found' });
    }

    // MANAGER cannot update ADMIN or other MANAGER
    if (req.user.role === 'MANAGER' && ['ADMIN', 'MANAGER'].includes(staff.role)) {
      return res.status(403).send({ message: 'Access denied' });
    }

    const { password, ...updateData } = req.body;

    // If password is being updated, hash it
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await staff.update(updateData);

    // Don't return password
    const { password: _, ...staffData } = staff.toJSON();

    res.send({ data: staffData });
  })
);

// ------------------------------------------
// DELETE STAFF
// ------------------------------------------
router.delete(
  '/:id',
  ensureAuth(['ADMIN', 'MANAGER']),
  route(async (req, res) => {
    const staff = await Staff.findByPk(req.params.id);

    if (!staff) {
      return res.status(404).send({ message: 'Staff not found' });
    }

    // MANAGER cannot delete ADMIN or other MANAGER
    if (req.user.role === 'MANAGER' && ['ADMIN', 'MANAGER'].includes(staff.role)) {
      return res.status(403).send({ message: 'Access denied' });
    }

    // Cannot delete yourself
    if (staff.id === req.user.id) {
      return res.status(400).send({ message: 'Cannot delete yourself' });
    }

    await staff.destroy();

    res.send({ message: 'Staff deleted successfully' });
  })
);

module.exports = router;
