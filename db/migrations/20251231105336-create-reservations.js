'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reservations', {
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
      customer_name: { type: Sequelize.STRING, allowNull: true },
      customer_phone: { type: Sequelize.STRING, allowNull: true },
      party_size: { type: Sequelize.INTEGER, allowNull: false },
      start_time: { type: Sequelize.DATE, allowNull: false },
      end_time: { type: Sequelize.DATE, allowNull: false },
      notes: { type: Sequelize.TEXT, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('reservations');
  },
};
