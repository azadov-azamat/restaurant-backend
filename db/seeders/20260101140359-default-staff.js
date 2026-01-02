'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const salt = await bcrypt.genSalt(10);

    await queryInterface.bulkInsert('staff', [
      {
        id: uuidv4(),
        full_name: 'Admin User',
        phone: '+998900000001',
        login_id: 'admin',
        password: await bcrypt.hash('admin123', salt),
        role: 'ADMIN',
        photo: null,
        created_at: now,
        updated_at: now,
      },
      {
        id: uuidv4(),
        full_name: 'Manager User',
        phone: '+998900000002',
        login_id: 'manager',
        password: await bcrypt.hash('manager123', salt),
        role: 'MANAGER',
        photo: null,
        created_at: now,
        updated_at: now,
      },
      {
        id: uuidv4(),
        full_name: 'Chef User',
        phone: '+998900000003',
        login_id: 'chef',
        password: await bcrypt.hash('chef123', salt),
        role: 'CHEF',
        photo: null,
        created_at: now,
        updated_at: now,
      },
      {
        id: uuidv4(),
        full_name: 'Waiter User',
        phone: '+998900000004',
        login_id: 'waiter',
        password: await bcrypt.hash('waiter123', salt),
        role: 'WAITER',
        photo: null,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('staff', {
      login_id: ['admin', 'manager', 'chef', 'waiter'],
    });
  },
};
