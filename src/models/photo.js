'use strict';
const {
  Model
} = require('sequelize');
const { SecureUri } = require('../thirdparty/storage/url');

module.exports = (sequelize, DataTypes) => {
  class photo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.album);

      this.hasMany(models.photo_has_people, {
        as:'people'
      })
    }
  }
  photo.init({
    image_path: DataTypes.STRING,
    album_id: DataTypes.INTEGER.UNSIGNED,
    thumb_path: DataTypes.STRING,
    thumb: {
      type: DataTypes.VIRTUAL,
      get() {
        if(this.getDataValue('thumb_path')) {
          return 'http://localhost:' + (process.env.PORT || 3000) + '/' + this.getDataValue('thumb_path')
        }

        return this.getDataValue('image_path');
      }
    }
  }, {
    sequelize,
    modelName: 'photo',
    underscored: true,
  });
  return photo;
};