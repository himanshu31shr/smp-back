'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('photos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      image_path: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      thumb_path: {
        type: Sequelize.STRING(60),
        allowNull: true
      },
      album_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addConstraint('photos', {
      fields: ['album_id'],
      type: 'foreign key',
      references: {
        table: 'albums',
        field: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('photos', 'photos_album_id_albums_fk');

    await queryInterface.dropTable('photos');
  }
};