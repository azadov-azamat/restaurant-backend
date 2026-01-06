const express = require('express');
const router = express.Router();

const route = require('../../utils/async-handler');
const ensureAuth = require('../../middleware/ensure-auth');
const parseOps = require('../../utils/qps')();
const pagination = require('../../utils/pagination');

const { MenuItem, Category, Media } = require('../../../db/models');
const { v4: uuidv4 } = require('uuid');
const { getSignedUploadUrl, deleteObject } = require('../../services/aws');

// ------------------------------------------
// CREATE MENU ITEM
// ------------------------------------------
router.post(
  '/',
  ensureAuth(['ADMIN', 'MANAGER']),
  route(async (req, res) => {
    const { name, categoryId, price, image, description, type, quantity } = req.body;

    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).send({ message: 'Category not found' });
    }

    const menuItem = await MenuItem.create({
      name,
      categoryId,
      price,
      image,
      description,
      type,
      quantity,
    });

    res.status(201).send({ data: menuItem });
  })
);

// ------------------------------------------
// GET ALL MENU ITEMS
// ------------------------------------------
router.get(
  '/',
  ensureAuth(),
  route(async (req, res) => {
    const query = parseOps(req.query);

    query.include = [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name'],
      },
      {
        model: Media,
        as: 'media',
        attributes: ['id', 'path', 'mediaType'],
      },
    ];
    query.order = [['createdAt', 'DESC']];

    const { rows: menuItems, count } = await MenuItem.findAndCountAll(query);

    res.send({
      data: menuItems,
      meta: pagination(query.limit, query.offset, count),
    });
  })
);

// POST /menu-items/:id/upload-url
router.post(
  '/:id/upload-url',
  ensureAuth(),
  route(async (req, res) => {
    const item = await MenuItem.findByPk(req.params.id);
    if (!item) {
      return res.status(404).send({ message: 'Menu item not found' });
    }

    const { filename, mimeType: contentType } = req.body;

    if (!filename || !contentType) {
      return res.status(400).send({ message: 'filename and contentType required' });
    }

    if (!contentType.startsWith('image/')) {
      return res.status(400).send({ message: 'Only image files allowed' });
    }

    // Unique S3 key yaratish
    const fileExtension = filename.split('.').pop();
    const s3Key = `menu-items/${item.id}/${uuidv4()}.${fileExtension}`;

    // Presigned URL yaratish
    const uploadUrl = await getSignedUploadUrl(s3Key, {
      ContentType: contentType,
    });

    // Public path (S3 full URL)
    const publicPath = `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${s3Key}`;

    // Eski media ni o'chirish
    if (item.mediaId) {
      const oldMedia = await Media.findByPk(item.mediaId);
      if (oldMedia?.path) {
        const oldKey = oldMedia.path.split('.amazonaws.com/')[1];
        if (oldKey) {
          try {
            await deleteObject(oldKey);
          } catch (error) {
            console.error('Failed to delete old S3 object:', error);
          }
        }
      }
      await Media.destroy({ where: { id: item.mediaId } });
    }

    // Yangi Media record yaratish
    const media = await Media.create({
      mediaType: 'photo',
      path: publicPath,
      contentType: contentType,
      order: 0,
      previewPath: null,
      tempSessionId: null,
    });

    await item.update({ mediaId: media.id });

    res.send({
      uploadUrl,
      publicPath,
      mediaId: media.id,
    });
  })
);

// PATCH /menu-items/:id/upload-complete
router.patch(
  '/:id/upload-complete',
  ensureAuth(),
  route(async (req, res) => {
    const item = await MenuItem.findByPk(req.params.id, {
      include: [
        { model: Media, as: 'media' },
        { model: Category, as: 'category' },
      ],
    });

    if (!item) {
      return res.status(404).send({ message: 'Menu item not found' });
    }

    res.send({ data: item });
  })
);

// PATCH /menu-items/:id/upload-complete
router.patch(
  '/:id/upload-complete',
  ensureAuth(),
  route(async (req, res) => {
    const item = await MenuItem.findByPk(req.params.id, {
      include: [
        { model: Media, as: 'media' },
        { model: Category, as: 'category' },
      ],
    });

    if (!item) {
      return res.status(404).send({ message: 'Menu item not found' });
    }

    res.send({ data: item });
  })
);

// ------------------------------------------
// GET MENU ITEMS BY CATEGORY
// ------------------------------------------
router.get(
  '/category/:categoryId',
  ensureAuth(),
  route(async (req, res) => {
    const menuItems = await MenuItem.findAll({
      where: { categoryId: req.params.categoryId },
      order: [['name', 'ASC']],
    });

    res.send({ data: menuItems });
  })
);

// ------------------------------------------
// GET ONE MENU ITEM BY ID
// ------------------------------------------
router.get(
  '/:id',
  ensureAuth(),
  route(async (req, res) => {
    const menuItem = await MenuItem.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          as: 'category',
        },
        {
          model: Media,
          as: 'media',
          attributes: ['id', 'path', 'mediaType'],
        },
      ],
    });

    if (!menuItem) {
      return res.status(404).send({ message: 'Menu item not found' });
    }

    res.send({ data: menuItem });
  })
);

// ------------------------------------------
// UPDATE MENU ITEM (PATCH)
// ------------------------------------------
router.patch(
  '/:id',
  ensureAuth(['ADMIN', 'MANAGER']),
  route(async (req, res) => {
    const menuItem = await MenuItem.findByPk(req.params.id);

    if (!menuItem) {
      return res.status(404).send({ message: 'Menu item not found' });
    }

    await menuItem.update(req.body);

    res.send({ data: menuItem });
  })
);

// ------------------------------------------
// DELETE MENU ITEM
// ------------------------------------------
router.delete(
  '/:id',
  ensureAuth(['ADMIN', 'MANAGER']),
  route(async (req, res) => {
    const menuItem = await MenuItem.findByPk(req.params.id);

    if (!menuItem) {
      return res.status(404).send({ message: 'Menu item not found' });
    }

    await menuItem.destroy();

    res.send({ message: 'Menu item deleted successfully' });
  })
);

module.exports = router;
