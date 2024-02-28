'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class album extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.photo);

      this.belongsTo(models.user);
    }
  }
  album.init({
    name: DataTypes.STRING,
    user_id: DataTypes.INTEGER.UNSIGNED
  }, {
    sequelize,
    modelName: 'album',
    underscored: true,
  });
  return album;
};