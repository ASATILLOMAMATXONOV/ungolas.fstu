"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Page extends Model {
    static associate(models) {
      this.belongsTo(models.Component, {
        foreignKey: "component_id",
        as: "component",
        onDelete: "SET NULL",
      });
    }
  }

  Page.init(
    {
      component_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      banner_ids: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
        defaultValue: [],
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
