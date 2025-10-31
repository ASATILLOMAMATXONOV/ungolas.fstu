//   ← Menular jadvali modeli



"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    static associate(models) {
      // Masalan, agar sizda "SubMenu" bo‘lsa:
      // this.hasMany(models.SubMenu, { foreignKey: "menuId" });
    }
  }

  Menu.init(
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
      content_uz: DataTypes.TEXT,
      content_ru: DataTypes.TEXT,
      content_en: DataTypes.TEXT,
      has_content: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Menu",
      tableName: "Menus",
    }
  );

  return Menu;
};
