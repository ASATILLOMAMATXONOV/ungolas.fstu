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

      component_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Components",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      banner_ids: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true,
      },

      title_uz: Sequelize.TEXT,
      title_ru: Sequelize.TEXT,
      title_en: Sequelize.TEXT,
      content_uz: Sequelize.TEXT,
      content_ru: Sequelize.TEXT,
      content_en: Sequelize.TEXT,

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Pages");
  },
};
