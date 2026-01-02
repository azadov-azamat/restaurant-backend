'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    static associate({ Order }) {
      Staff.hasMany(Order, {
        as: 'orders',
        foreignKey: 'staffId',
      });
    }
  }

  Staff.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      loginId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Hashed password',
      },

      photo: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      role: {
        type: DataTypes.ENUM('ADMIN', 'MANAGER', 'CHEF', 'WAITER'),
        allowNull: false,
        defaultValue: 'WAITER',
      },
    },
    {
      sequelize,
      modelName: 'Staff',
      tableName: 'staff',
      timestamps: true,
      underscored: true,
    }
  );

  return Staff;
};
