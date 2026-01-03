'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('media', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      url: { type: Sequelize.STRING, allowNull: true },
      path: { type: Sequelize.STRING, allowNull: true },
      filename: { type: Sequelize.STRING, allowNull: true },
      mime_type: { type: Sequelize.STRING, allowNull: true },
      size: { type: Sequelize.INTEGER, allowNull: true },

      provider: {
        type: Sequelize.ENUM('local', 's3'),
        allowNull: false,
        defaultValue: 'local',
      },

      owner_type: {
        type: Sequelize.ENUM('staff', 'menuItem'),
        allowNull: true,
      },
      owner_id: { type: Sequelize.UUID, allowNull: true },

      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('media');

    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_media_provider";');
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_media_ownerType";');
    }
  },
};
