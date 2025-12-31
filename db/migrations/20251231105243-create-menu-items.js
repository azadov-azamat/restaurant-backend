'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('menu_items', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: { type: Sequelize.STRING, allowNull: false },
      category_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'categories', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      image: { type: Sequelize.STRING, allowNull: true },
      description: { type: Sequelize.TEXT, allowNull: true },
      type: {
        type: Sequelize.ENUM('KITCHEN_MADE', 'READY_STOCK'),
        allowNull: false,
        defaultValue: 'KITCHEN_MADE',
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Stock quantity for READY_STOCK items',
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('menu_items');
    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_menu_items_type";');
    }
  },
};
