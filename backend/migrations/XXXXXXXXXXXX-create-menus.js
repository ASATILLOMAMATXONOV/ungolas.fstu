//   Sequelize orqali jadval (table) yaratish uchun fayllar


"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Menus", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title_uz: {
        type: Sequelize.TEXT,
      },
      title_ru: {
        type: Sequelize.TEXT,
      },
      title_en: {
        type: Sequelize.TEXT,
      },
      content_uz: {
        type: Sequelize.TEXT,
      },
      content_ru: {
        type: Sequelize.TEXT,
      },
      content_en: {
        type: Sequelize.TEXT,
      },
      has_content: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Menus");
  },
};
