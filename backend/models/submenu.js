"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Submenu extends Model {
    static associate(models) {
      // 🔹 Har bir submenyu bitta asosiy menyuga tegishli
      this.belongsTo(models.Menu, {
        foreignKey: "menu_id",
        as: "menu",
        onDelete: "CASCADE",
      });
    }
  }

  Submenu.init(
    {
      menu_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Menus",
          key: "id",
        },
      },
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
      modelName: "Submenu",
      tableName: "Submenus",
    }
  );

  return Submenu;
};
