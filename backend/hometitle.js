"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class HomeTitle extends Model {
    static associate(models) {}
  }

  HomeTitle.init(
    {
      title_uz: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title_ru: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title_en: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      desc_uz: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      desc_ru: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      desc_en: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "HomeTitle",
      tableName: "HomeTitles",
    }
  );

  return HomeTitle;
};
