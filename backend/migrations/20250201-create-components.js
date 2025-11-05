"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("components", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      banner_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "banners", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      title_uz: { type: Sequelize.TEXT, allowNull: true },
      title_ru: { type: Sequelize.TEXT, allowNull: true },
      title_en: { type: Sequelize.TEXT, allowNull: true },
      content_uz: { type: Sequelize.TEXT("long"), allowNull: true },
      content_ru: { type: Sequelize.TEXT("long"), allowNull: true },
      content_en: { type: Sequelize.TEXT("long"), allowNull: true },
      image_uz: { type: Sequelize.STRING, allowNull: true },
      image_ru: { type: Sequelize.STRING, allowNull: true },
      image_en: { type: Sequelize.STRING, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP") },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("components");
  },
};
