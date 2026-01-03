'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('media', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      media_type: {
        type: Sequelize.ENUM('photo', 'video'),
      },
      path: {
        type: Sequelize.STRING,
      },
      preview_path: {
        type: Sequelize.STRING,
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      staff_id: {
        type: Sequelize.UUID,
        references: {
          model: 'staff',
          key: 'id',
        },
      },
      menu_item_id: {
        type: Sequelize.UUID,
        references: {
          model: 'menu_items',
          key: 'id',
        },
      },
      temp_session_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      content_type: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("(now() at time zone 'utc')"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("(now() at time zone 'utc')"),
      },
    });

    await queryInterface.addIndex('media', ['temp_session_id'], {
      name: 'media_temp_session_id_index',
    });
  },

  async down(queryInterface, Sequelize) {
    // remove the index explicitly (dropTable would also remove it, but this is safe & clear)
    try {
      await queryInterface.removeIndex('media', 'media_temp_session_id_index');
    } catch (e) {
      // ignore if it doesn't exist
    }
    await queryInterface.dropTable('media');
  },
};
