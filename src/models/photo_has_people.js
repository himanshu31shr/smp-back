'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class photo_has_people extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.people, {
        foreignKey: 'people_id',
        targetKey: 'id'
      });

      this.belongsTo(models.photo);
    }
  }
  photo_has_people.init({
    photo_id: DataTypes.INTEGER.UNSIGNED,
    people_id: DataTypes.INTEGER.UNSIGNED
  }, {
    sequelize,
    modelName: 'photo_has_people',
    underscored: true,
    timestamps: false
  });
  return photo_has_people;
};