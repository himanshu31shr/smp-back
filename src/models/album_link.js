'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class album_link extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  album_link.init({
    album_id: DataTypes.INTEGER.UNSIGNED,
    code: DataTypes.STRING,
    access_type: DataTypes.INTEGER.UNSIGNED
  }, {
    sequelize,
    modelName: 'album_link',
    underscored: true,
  });
  return album_link;
};