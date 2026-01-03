const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const route = require('../../utils/async-handler');
const ensureAuth = require('../../middleware/ensure-auth');
const parseOps = require('../../utils/qps')();
const pagination = require('../../utils/pagination');
const { Staff, Media } = require('../../../db/models');
const { v4: uuidv4 } = require('uuid');
const { getSignedUploadUrl, deleteObject } = require('../../services/aws');
// ------------------------------------------
// CREATE STAFF
// ------------------------------------------
router.post(
  '/',
  ensureAuth(['ADMIN', 'MANAGER']),
  route(async (req, res) => {
    const { fullName, phone, loginId, password, role, photo } = req.body;

    // MANAGER can only create CHEF and WAITER
    if (req.user.role === 'MANAGER' && ['ADMIN', 'MANAGER'].includes(role)) {
      return res.status(403).send({ message: 'Managers cannot create Admin or Manager roles' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = await Staff.create({
      fullName,
      phone,
      loginId,
      password: hashedPassword,
      role,
      photo,
    });

    // Don't return password
    const { password: _, ...staffData } = staff.toJSON();

    res.status(201).send({ data: staffData });
  })
);

router.post(
  '/:id/upload-url',
  ensureAuth(),
  route(async (req, res) => {
    const staff = await Staff.findByPk(req.params.id);
    if (!staff) {
      return res.status(404).send({ message: 'Staff not found' });
    }

    const { filename, mimeType } = req.body;

    if (!filename || !mimeType) {
      return res.status(400).send({ message: 'filename and mimeType required' });
    }

    // Faqat rasm formatlarini qabul qilish
    if (!mimeType.startsWith('image/')) {
      return res.status(400).send({ message: 'Only image files allowed' });
    }

    // Unique S3 key yaratish
    const fileExtension = filename.split('.').pop();
    const uniqueKey = `staff/${staff.id}/${uuidv4()}.${fileExtension}`;

    // Presigned URL yaratish (sizning function)
    const uploadUrl = await getSignedUploadUrl(uniqueKey, {
      ContentType: mimeType,
    });

    // Public URL
    const publicUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${uniqueKey}`;

    // Eski media ni o'chirish (agar mavjud bo'lsa)
    if (staff.mediaId) {
      const oldMedia = await Media.findByPk(staff.mediaId);
      if (oldMedia?.key) {
        await deleteObject(oldMedia.key);
      }
      // Eski media record ni o'chirish yoki yangilash
      await Media.destroy({ where: { id: staff.mediaId } });
    }

    // Yangi Media record yaratish
    const media = await Media.create({
      provider: 's3',
      ownerType: 'staff',
      ownerId: staff.id,
      filename,
      mimeType,
      url: publicUrl,
      key: uniqueKey,
      size: 0, // Frontend dan keladi
    });

    // Staff ni yangilash
    await staff.update({ mediaId: media.id });

    res.send({
      uploadUrl,
      publicUrl,
      mediaId: media.id,
    });
  })
);

// PATCH /staff/:id/upload-complete - Upload tugaganini tasdiqlash
router.patch(
  '/:id/upload-complete',
  ensureAuth(),
  route(async (req, res) => {
    const staff = await Staff.findByPk(req.params.id);
    if (!staff || !staff.mediaId) {
      return res.status(404).send({ message: 'Staff or media not found' });
    }

    const { size } = req.body;

    // Media ni update qilish
    await Media.update({ size }, { where: { id: staff.mediaId } });

    const updatedStaff = await Staff.findByPk(staff.id, {
      include: [{ model: Media, as: 'media' }],
      attributes: { exclude: ['password'] },
    });

    res.send({ data: updatedStaff });
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
