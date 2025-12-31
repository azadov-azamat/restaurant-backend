'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate({ Room, Staff, OrderItem }) {
      Order.belongsTo(Room, {
        as: 'room',
        foreignKey: 'roomId',
      });

      Order.belongsTo(Staff, {
        as: 'staff',
        foreignKey: 'staffId',
      });

      Order.hasMany(OrderItem, {
        as: 'items',
        foreignKey: 'orderId',
      });
    }
  }

  Order.init(
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

      staffId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'staff',
          key: 'id',
        },
        onDelete: 'RESTRICT',
      },

      status: {
        type: DataTypes.ENUM('OPEN', 'IN_PROGRESS', 'COMPLETED', 'PAID', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'OPEN',
      },
    },
    {
      sequelize,
      modelName: 'Order',
      tableName: 'orders',
      timestamps: true,

      // Sizning attribute nomlaringiz camelCase (roomId, staffId).
      // Shuning uchun underscored: false qoldirildi.
      underscored: false,
    }
  );

  return Order;
};
