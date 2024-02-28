'use strict';
const {
  Model
} = require('sequelize');
const { secret, expiration, refresh_token_expiration, refresh_token_secret } = require('../config/auth')();
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    generateAccessToken() {
      return jwt.sign({
        name: this.getDataValue('name'),
        id: this.getDataValue('id'),
      }, secret, {
        expiresIn: expiration,
      });
    }

    generateRefreshToken() {
      return jwt.sign({
        name: this.getDataValue('name'),
        id: this.getDataValue('id'),
      }, refresh_token_secret, {
        expiresIn: refresh_token_expiration,
      });
    }
    
  }
  user.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    email_verified: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'user',
    underscored: true,
  });
  return user;
};