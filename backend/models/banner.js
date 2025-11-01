"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Banner extends Model {}

  Banner.init(
    {
      title_uz: DataTypes.STRING,
      title_ru: DataTypes.STRING,
      title_en: DataTypes.STRING,
      image_uz: DataTypes.STRING,
      image_ru: DataTypes.STRING,
      image_en: DataTypes.STRING,
      link: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Banner",
      tableName: "Banners",
    }
  );

  return Banner;
};
