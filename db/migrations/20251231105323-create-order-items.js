'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_items', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      order_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'orders', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      menu_item_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'menu_items', key: 'id' },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      quantity: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      notes: { type: Sequelize.TEXT, allowNull: true },
      status: {
        type: Sequelize.ENUM('PENDING', 'SENT', 'PREPARING', 'READY', 'DELIVERED'),
        allowNull: false,
        defaultValue: 'PENDING',
      },
      requires_kitchen: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'True if menuItem.type is KITCHEN_MADE',
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('order_items');
    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_order_items_status";');
    }
  },
};
