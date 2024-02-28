'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class people_has_face extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  people_has_face.init({
    people_id: DataTypes.NUMBER,
    image_path: DataTypes.STRING(60)
  }, {
    sequelize,
    modelName: 'people_has_face',
    underscored: true,
  });
  return people_has_face;
};