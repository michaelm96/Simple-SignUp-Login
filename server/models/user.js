"use strict";
const { Model } = require("sequelize");
const { bcryptPass } = require("../helpers/encrypt");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  }

  User.init(
    {
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Email should not be null",
          },
          notEmpty: {
            msg: "Email should not be empty",
          },
        },
        unique: {
          args: true,
          msg: "Email address already in use!",
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Password should not be null",
          },
          notEmpty: {
            msg: "Password should not be empty",
          },
        },
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      loggedInTimes: { 
        type: DataTypes.INTEGER, 
        defaultValue: 0,
      },
      lastSession: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  User.beforeCreate((user, options) => {
    if(user.password !== "oauth"){
      user.password = bcryptPass(user.password);
    }
  });
  
  User.beforeUpdate((user, options) => {
    user.password = bcryptPass(user.password);
  })

  User.associate = (models) => {
    // define association here
  };
  return User;
};
