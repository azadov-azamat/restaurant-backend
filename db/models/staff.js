'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    static associate({ Order, Media }) {
      Staff.hasMany(Order, {
        as: 'orders',
        foreignKey: 'staffId',
      });
      Staff.belongsTo(Media, {
        as: 'media',
        foreignKey: 'mediaId',
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
  )
    // ✅ Staff yaratilgandan so‘ng Media row yaratib, mediaId set qilish
    .addHook('afterCreate', async (staff, options) => {
      const { Media } = sequelize.models;

      // agar allaqachon mediaId berilgan bo‘lsa (masalan import), qaytib ketamiz
      if (staff.mediaId) return;

      const media = await Media.create(
        {
          provider: 'local',
          ownerType: 'staff',
          ownerId: staff.id,
        },
        { transaction: options.transaction }
      );

      await staff.update({ mediaId: media.id }, { transaction: options.transaction });
    });

  return Staff;
};
