'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MenuItem extends Model {
    static associate({ Category, OrderItem }) {
      MenuItem.belongsTo(Category, {
        as: 'category',
        foreignKey: 'categoryId',
      });

      MenuItem.hasMany(OrderItem, {
        as: 'orderItems',
        foreignKey: 'menuItemId',
      });
    }
  }

  MenuItem.init(
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

      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },

      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      type: {
        type: DataTypes.ENUM('KITCHEN_MADE', 'READY_STOCK'),
        allowNull: false,
        defaultValue: 'KITCHEN_MADE',
      },

      quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Stock quantity for READY_STOCK items',
      },
    },
    {
      sequelize,
      modelName: 'MenuItem',
      tableName: 'menu_items',
      timestamps: true,

      // Muhim: sizda attribute "categoryId" camelCase.
      // underscored: true qilsak Sequelize ko‘p joyda category_id deb kutishi mumkin.
      underscored: true,
    }
  );

  return MenuItem;
};
