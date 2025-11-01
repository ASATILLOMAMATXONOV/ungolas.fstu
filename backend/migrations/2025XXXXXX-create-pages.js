"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Pages", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      banner_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Banners",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      title_uz: { type: Sequelize.STRING },
      title_ru: { type: Sequelize.STRING },
      title_en: { type: Sequelize.STRING },
      content_uz: { type: Sequelize.TEXT },
      content_ru: { type: Sequelize.TEXT },
      content_en: { type: Sequelize.TEXT },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Pages");
  },
};
