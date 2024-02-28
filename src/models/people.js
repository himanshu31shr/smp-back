'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class people extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      this.hasMany(models.photo_has_people, {
        foreignKey: 'people_id',
        targetKey: 'id'
      })
    }
  }
  people.init({
    album_id: DataTypes.INTEGER.UNSIGNED,
    representation: DataTypes.TEXT,
    image_path: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'people',
    underscored: true
  });
  return people;
};