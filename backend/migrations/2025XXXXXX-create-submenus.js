"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Submenus", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      menu_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Menus", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      title_uz: { type: Sequelize.TEXT, allowNull: true },
      title_ru: { type: Sequelize.TEXT, allowNull: true },
      title_en: { type: Sequelize.TEXT, allowNull: true },

      content_uz: { type: Sequelize.TEXT, allowNull: true },
      content_ru: { type: Sequelize.TEXT, allowNull: true },
      content_en: { type: Sequelize.TEXT, allowNull: true },

      has_content: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("Submenus", ["menu_id"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Submenus");
  },
};
