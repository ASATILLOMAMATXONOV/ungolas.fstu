"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class NewPage extends Model {}
  NewPage.init(
    {
      title_uz: DataTypes.TEXT,
      title_ru: DataTypes.TEXT,
      title_en: DataTypes.TEXT,
      content_uz: DataTypes.TEXT,
      content_ru: DataTypes.TEXT,
      content_en: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "NewPage",
      tableName: "new_pages",
      underscored: true,
    }
  );
  return NewPage;
};
