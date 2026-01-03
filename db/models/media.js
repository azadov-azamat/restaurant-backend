'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Media extends Model {
    static associate({ Staff, MenuItem }) {
      // Bitta media row odatda bitta ownerga tegishli bo‘ladi (1:1),
      // lekin biz FK'ni owner modelida saqlayapmiz (mediaId), shuning uchun:
      Media.hasOne(Staff, { as: 'staff', foreignKey: 'mediaId' });
      Media.hasOne(MenuItem, { as: 'menuItem', foreignKey: 'mediaId' });
    }
  }

  Media.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      // Fayl qayerda turgani (local path yoki URL)
      url: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      // Local storage uchun masalan: uploads/abc.jpg
      path: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      // original filename
      filename: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      mimeType: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      size: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'File size in bytes',
      },

      // Keyinchalik kerak bo‘lsa (CDN/S3 key)
      provider: {
        type: DataTypes.ENUM('local', 's3'),
        allowNull: false,
        defaultValue: 'local',
      },

      // Qaysi entity uchun yaratilganini log qilish uchun (shart emas, lekin foydali)
      ownerType: {
        type: DataTypes.ENUM('staff', 'menuItem'),
        allowNull: true,
      },
      ownerId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Media',
      tableName: 'media',
      timestamps: true,
      underscored: false,
      freezeTableName: true,
    }
  );

  return Media;
};
