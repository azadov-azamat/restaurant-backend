'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('staff', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      full_name: { type: Sequelize.STRING, allowNull: false },
      phone: { type: Sequelize.STRING, allowNull: false },
      login_id: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false, comment: 'Hashed password' },
      photo: { type: Sequelize.STRING, allowNull: true },
      role: {
        type: Sequelize.ENUM('ADMIN', 'MANAGER', 'CHEF', 'WAITER'),
        allowNull: false,
        defaultValue: 'WAITER',
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('staff');
    // ENUM tozalash (PostgreSQL): ixtiyoriy, lekin yaxshi amaliyot
    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_staff_role";');
    }
  },
};
