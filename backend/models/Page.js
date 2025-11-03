"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Page extends Model {
    static associate(models) {
      this.belongsTo(models.Banner, {
        foreignKey: "banner_id",
        as: "banner",
        onDelete: "SET NULL",
      });
    }
  }

  Page.init(
    {
      banner_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Banners",
          key: "id",
        },
      },
      banner_ids: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
      },
      title_uz: DataTypes.TEXT,
      title_ru: DataTypes.TEXT,
      title_en: DataTypes.TEXT,
      content_uz: DataTypes.TEXT,
      content_ru: DataTypes.TEXT,
      content_en: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Page",
      tableName: "Pages",
    }
  );

  return Page;
};
