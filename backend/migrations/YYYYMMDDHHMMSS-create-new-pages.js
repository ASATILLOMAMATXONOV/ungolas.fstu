"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("new_pages", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      title_uz: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      title_ru: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      title_en: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      content_uz: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      content_ru: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      content_en: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("new_pages");
  },
};
