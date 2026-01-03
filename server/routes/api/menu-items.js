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

    const { filename, mimeType } = req.body;

    if (!filename || !mimeType) {
      return res.status(400).send({ message: 'filename and mimeType required' });
    }

    if (!mimeType.startsWith('image/')) {
      return res.status(400).send({ message: 'Only image files allowed' });
    }

    const fileExtension = filename.split('.').pop();
    const uniqueKey = `menu-items/${item.id}/${uuidv4()}.${fileExtension}`;

    const uploadUrl = await getSignedUploadUrl(uniqueKey, {
      ContentType: mimeType,
    });

    const publicUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${uniqueKey}`;

    // Eski media ni o'chirish
    if (item.mediaId) {
      const oldMedia = await Media.findByPk(item.mediaId);
      if (oldMedia?.key) {
        await deleteObject(oldMedia.key);
      }
      await Media.destroy({ where: { id: item.mediaId } });
    }

    const media = await Media.create({
      provider: 's3',
      ownerType: 'menuItem',
      ownerId: item.id,
      filename,
      mimeType,
      url: publicUrl,
      key: uniqueKey,
      size: 0,
    });

    await item.update({ mediaId: media.id });

    res.send({
      uploadUrl,
      publicUrl,
      mediaId: media.id,
    });
  })
);

// PATCH /menu-items/:id/upload-complete
router.patch(
  '/:id/upload-complete',
  ensureAuth(),
  route(async (req, res) => {
    const item = await MenuItem.findByPk(req.params.id);
    if (!item || !item.mediaId) {
      return res.status(404).send({ message: 'Menu item or media not found' });
    }

    const { size } = req.body;

    await Media.update({ size }, { where: { id: item.mediaId } });

    const updatedItem = await MenuItem.findByPk(item.id, {
      include: [
        { model: Media, as: 'media' },
        { model: Category, as: 'category' },
      ],
    });

    res.send({ data: updatedItem });
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
