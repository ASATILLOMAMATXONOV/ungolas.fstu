"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        // here we store hashed password
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {}
  );

  return User;
};
