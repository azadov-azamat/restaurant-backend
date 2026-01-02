const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const route = require('../../utils/async-handler');
const { Staff } = require('../../../db/models');

// ------------------------------------------
// LOGIN
// ------------------------------------------
router.post(
  '/login',
  route(async (req, res) => {
    const { loginId, password } = req.body;

    if (!loginId || !password) {
      return res.status(400).send({ message: 'Login ID and password are required' });
    }

    const staff = await Staff.findOne({ where: { loginId } });

    if (!staff) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, staff.password);

    if (!isPasswordValid) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: staff.id,
        loginId: staff.loginId,
        role: staff.role,
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.send({
      token,
      staff: {
        id: staff.id,
        fullName: staff.fullName,
        loginId: staff.loginId,
        role: staff.role,
        photo: staff.photo,
      },
    });
  })
);

// ------------------------------------------
// GET CURRENT USER
// ------------------------------------------
router.get(
  '/me',
  require('../../middleware/ensure-auth')(),
  route(async (req, res) => {
    const staff = await Staff.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });

    if (!staff) {
      return res.status(404).send({ message: 'Staff not found' });
    }

    res.send({ data: staff });
  })
);

module.exports = router;
