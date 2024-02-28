'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('photo_has_people', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      photo_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      people_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      }
    });

    await queryInterface.addConstraint('photo_has_people', {
      fields: ['people_id'],
      type: 'foreign key',
      references: {
        table: 'people',
        field: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    });

    await queryInterface.addConstraint('photo_has_people', {
      fields: ['photo_id'],
      type: 'foreign key',
      references: {
        table: 'photos',
        field: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('photo_has_people', 'photo_has_people_people_id_people_fk');
    await queryInterface.removeConstraint('photo_has_people', 'photo_has_people_photo_id_photos_fk');
    await queryInterface.dropTable('photo_has_people');
  }
};