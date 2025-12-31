'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    static associate({ Floor, RoomElement, Order, Reservation }) {
      Room.belongsTo(Floor, {
        as: 'floor',
        foreignKey: 'floorId',
      });

      Room.hasMany(RoomElement, {
        as: 'elements',
        foreignKey: 'roomId',
      });

      Room.hasMany(Order, {
        as: 'orders',
        foreignKey: 'roomId',
      });

      Room.hasMany(Reservation, {
        as: 'reservations',
        foreignKey: 'roomId',
      });
    }
  }

  Room.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      floorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'floors',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },

      width: {
        type: DataTypes.FLOAT,
        allowNull: false,
        comment: 'Width in meters',
      },

      height: {
        type: DataTypes.FLOAT,
        allowNull: false,
        comment: 'Height in meters',
      },
    },
    {
      sequelize,
      modelName: 'Room',
      tableName: 'rooms',
      timestamps: true,
      underscored: false,
    }
  );

  return Room;
};
