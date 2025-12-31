'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rooms', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: { type: Sequelize.STRING, allowNull: false },
      floor_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'floors', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      width: { type: Sequelize.FLOAT, allowNull: false, comment: 'Width in meters' },
      height: { type: Sequelize.FLOAT, allowNull: false, comment: 'Height in meters' },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('rooms');
  },
};
