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
      title_uz: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title_ru: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      title_en: {
        type: DataTypes.STRING,
        allowNull: true,
      },
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
