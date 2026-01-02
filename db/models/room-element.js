'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RoomElement extends Model {
    static associate({ Room }) {
      RoomElement.belongsTo(Room, {
        as: 'room',
        foreignKey: 'roomId',
      });
    }
  }

  RoomElement.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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

      type: {
        type: DataTypes.ENUM('table', 'chair', 'sofa', 'door', 'window'),
        allowNull: false,
      },

      // Position and dimensions (in meters)
      x: {
        type: DataTypes.FLOAT,
        allowNull: true,
        comment: 'X coordinate for furniture (meters)',
      },

      y: {
        type: DataTypes.FLOAT,
        allowNull: true,
        comment: 'Y coordinate for furniture (meters)',
      },

      width: {
        type: DataTypes.FLOAT,
        allowNull: true,
        comment: 'Width for furniture (meters)',
      },

      height: {
        type: DataTypes.FLOAT,
        allowNull: true,
        comment: 'Height for furniture (meters)',
      },

      rotation: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
        comment: 'Rotation in degrees',
      },

      // Table specific
      variant: {
        type: DataTypes.ENUM('with_chairs', 'with_sofa'),
        allowNull: true,
        comment: 'For tables only',
      },

      seats: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Number of seats for tables',
      },

      tableCode: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Table identifier (T1, T2, etc.)',
      },

      // Wall features (door/window)
      wall: {
        type: DataTypes.ENUM('N', 'E', 'S', 'W'),
        allowNull: true,
        comment: 'Wall direction for doors/windows',
      },

      offset: {
        type: DataTypes.FLOAT,
        allowNull: true,
        comment: 'Offset along wall (meters)',
      },

      length: {
        type: DataTypes.FLOAT,
        allowNull: true,
        comment: 'Length of door/window (meters)',
      },

      // Door specific
      swing: {
        type: DataTypes.ENUM('left', 'right', 'both', 'none'),
        allowNull: true,
        comment: 'Door swing direction',
      },
    },
    {
      sequelize,
      modelName: 'RoomElement',
      tableName: 'room_elements',
      timestamps: true,
      underscored: true,
    }
  );

  return RoomElement;
};
