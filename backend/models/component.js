// backend/models/component.js
"use strict";
module.exports = (sequelize, DataTypes) => {
  const Component = sequelize.define(
    "Component",
    {
      banner_id: { type: DataTypes.INTEGER, allowNull: true },
      title_uz: { type: DataTypes.TEXT, allowNull: true },
      title_ru: { type: DataTypes.TEXT, allowNull: true },
      title_en: { type: DataTypes.TEXT, allowNull: true },
      content_uz: { type: DataTypes.TEXT("long"), allowNull: true },
      content_ru: { type: DataTypes.TEXT("long"), allowNull: true },
      content_en: { type: DataTypes.TEXT("long"), allowNull: true },
      image_uz: { type: DataTypes.STRING, allowNull: true },
      image_ru: { type: DataTypes.STRING, allowNull: true },
      image_en: { type: DataTypes.STRING, allowNull: true },
    },
    {
      tableName: "components",
      underscored: true,
    }
  );

  Component.associate = function (models) {
    Component.belongsTo(models.Banner, { foreignKey: "banner_id", as: "banner" });
  };

  return Component;
};
