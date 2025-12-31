'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    static associate({ Room }) {
      Reservation.belongsTo(Room, {
        as: 'room',
        foreignKey: 'roomId',
      });
    }
  }

  Reservation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      tableId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'References RoomElement with type=table',
      },

      roomId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'rooms',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },

      customerName: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      customerPhone: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      partySize: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      endTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Reservation',
      tableName: 'reservations',
      timestamps: true,

      // CamelCase FKlar saqlangan
      underscored: false,
    }
  );

  return Reservation;
};
