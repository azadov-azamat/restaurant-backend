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

    const { filename, contentType } = req.body;

    if (!filename || !contentType) {
      return res.status(400).send({ message: 'filename and contentType required' });
    }

    // Faqat rasm formatlarini qabul qilish
    if (!contentType.startsWith('image/')) {
      return res.status(400).send({ message: 'Only image files allowed' });
    }

    // Unique S3 key yaratish
    const fileExtension = filename.split('.').pop();
    const s3Key = `staff/${staff.id}/${uuidv4()}.${fileExtension}`;

    // Presigned URL yaratish
    const uploadUrl = await getSignedUploadUrl(s3Key, {
      ContentType: contentType,
    });

    // Public path (S3 full URL)
    const publicPath = `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${s3Key}`;

    // Eski media ni o'chirish va yangi yaratish
    if (staff.mediaId) {
      const oldMedia = await Media.findByPk(staff.mediaId);
      if (oldMedia?.path) {
        // S3 dan eski rasmni o'chirish
        const oldKey = oldMedia.path.split('.amazonaws.com/')[1];
        if (oldKey) {
          try {
            await deleteObject(oldKey);
          } catch (error) {
            console.error('Failed to delete old S3 object:', error);
          }
        }
      }
      // Eski media record ni o'chirish
      await Media.destroy({ where: { id: staff.mediaId } });
    }

    // Yangi Media record yaratish (faqat kerakli fieldlar)
    const media = await Media.create({
      mediaType: 'photo',
      path: publicPath,
      contentType: contentType,
      order: null,
      previewPath: null,
      tempSessionId: null,
    });

    // Staff ni yangilash
    await staff.update({ mediaId: media.id });

    res.send({
      uploadUrl,
      publicPath,
      mediaId: media.id,
    });
  })
);

// PATCH /staff/:id/upload-complete - Upload tugaganini tasdiqlash (optional)
router.patch(
  '/:id/upload-complete',
  ensureAuth(),
  route(async (req, res) => {
    const staff = await Staff.findByPk(req.params.id, {
      include: [{ model: Media, as: 'media' }],
      attributes: { exclude: ['password'] },
    });

    if (!staff) {
      return res.status(404).send({ message: 'Staff not found' });
    }

    res.send({ data: staff });
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
