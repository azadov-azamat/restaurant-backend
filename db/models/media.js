'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Media extends Model {
    static associate({ Staff, MenuItem }) {
      Media.hasOne(Staff, { as: 'staff', foreignKey: 'mediaId' });
      Media.hasOne(MenuItem, { as: 'menuItem', foreignKey: 'mediaId' });
    }
  }
  Media.init(
    {
      mediaType: DataTypes.ENUM('photo', 'video'),
      order: DataTypes.INTEGER,
      path: DataTypes.STRING,
      contentType: DataTypes.STRING,
      previewPath: DataTypes.STRING,
      tempSessionId: DataTypes.STRING,
    },
    {
      sequelize,
      underscored: true,
      modelName: 'Media',
    }
  );
  return Media;
};
