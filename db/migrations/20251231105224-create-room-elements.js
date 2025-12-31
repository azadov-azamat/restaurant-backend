'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('room_elements', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      room_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'rooms', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      type: {
        type: Sequelize.ENUM('table', 'chair', 'sofa', 'door', 'window'),
        allowNull: false,
      },

      x: { type: Sequelize.FLOAT, allowNull: true, comment: 'X coordinate for furniture (meters)' },
      y: { type: Sequelize.FLOAT, allowNull: true, comment: 'Y coordinate for furniture (meters)' },
      width: { type: Sequelize.FLOAT, allowNull: true, comment: 'Width for furniture (meters)' },
      height: { type: Sequelize.FLOAT, allowNull: true, comment: 'Height for furniture (meters)' },
      rotation: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0,
        comment: 'Rotation in degrees',
      },

      variant: {
        type: Sequelize.ENUM('with_chairs', 'with_sofa'),
        allowNull: true,
        comment: 'For tables only',
      },
      seats: { type: Sequelize.INTEGER, allowNull: true, comment: 'Number of seats for tables' },
      table_code: { type: Sequelize.STRING, allowNull: true, comment: 'Table identifier (T1, T2, etc.)' },

      wall: {
        type: Sequelize.ENUM('N', 'E', 'S', 'W'),
        allowNull: true,
        comment: 'Wall direction for doors/windows',
      },
      offset: { type: Sequelize.FLOAT, allowNull: true, comment: 'Offset along wall (meters)' },
      length: { type: Sequelize.FLOAT, allowNull: true, comment: 'Length of door/window (meters)' },

      swing: {
        type: Sequelize.ENUM('left', 'right', 'both', 'none'),
        allowNull: true,
        comment: 'Door swing direction',
      },

      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('room_elements');

    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_room_elements_type";');
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_room_elements_variant";');
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_room_elements_wall";');
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_room_elements_swing";');
    }
  },
};
