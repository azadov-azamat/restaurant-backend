'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      table_id: {
        type: Sequelize.UUID,
        allowNull: false,
        comment: 'References RoomElement with type=table',
      },
      room_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'rooms', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      staff_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'staff', key: 'id' },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      status: {
        type: Sequelize.ENUM('OPEN', 'IN_PROGRESS', 'COMPLETED', 'PAID', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'OPEN',
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('orders');
    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_orders_status";');
    }
  },
};
