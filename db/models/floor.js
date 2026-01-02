'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Floor extends Model {
    static associate({ Room }) {
      // Hozircha bog‘lanish yo‘q (rasmdagi kabi).
      Floor.hasMany(Room, { foreignKey: 'floorId', as: 'rooms' });
    }
  }

  Floor.init(
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
    },
    {
      sequelize,
      modelName: 'Floor',
      tableName: 'floors',
      timestamps: true,
      underscored: true,
    }
  );

  return Floor;
};
