"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash("ungolasRTTM2025", 10);

    await queryInterface.bulkInsert("Users", [
      {
        username: "ungolasRTTM",
        password: passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", { username: "ungolasRTTM" }, {});
  },
};
