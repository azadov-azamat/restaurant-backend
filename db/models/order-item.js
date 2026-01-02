'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate({ Order, MenuItem }) {
      OrderItem.belongsTo(Order, {
        as: 'order',
        foreignKey: 'orderId',
      });

      OrderItem.belongsTo(MenuItem, {
        as: 'menuItem',
        foreignKey: 'menuItemId',
      });
    }
  }

  OrderItem.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      orderId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },

      menuItemId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'menu_items',
          key: 'id',
        },
        onDelete: 'RESTRICT',
      },

      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },

      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM('PENDING', 'SENT', 'PREPARING', 'READY', 'DELIVERED'),
        allowNull: false,
        defaultValue: 'PENDING',
      },

      requiresKitchen: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'True if menuItem.type is KITCHEN_MADE',
      },
    },
    {
      sequelize,
      modelName: 'OrderItem',
      tableName: 'order_items',
      timestamps: true,
      underscored: true,
    }
  );

  return OrderItem;
};
