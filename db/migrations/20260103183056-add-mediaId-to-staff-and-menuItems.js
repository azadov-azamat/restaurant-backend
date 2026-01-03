'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // staff.mediaId
    await queryInterface.addColumn('staff', 'media_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: 'media', key: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    // menu_items.mediaId
    await queryInterface.addColumn('menu_items', 'media_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: 'media', key: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    // Optional indexlar
    await queryInterface.addIndex('staff', ['media_id']);
    await queryInterface.addIndex('menu_items', ['media_id']);
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('menu_items', ['media_id']);
    await queryInterface.removeIndex('staff', ['media_id']);

    await queryInterface.removeColumn('menu_items', 'media_id');
    await queryInterface.removeColumn('staff', 'media_id');
  },
};
