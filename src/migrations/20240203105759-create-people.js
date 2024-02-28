'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('people', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      album_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      representation: {
        type: Sequelize.TEXT
      },
      image_path: {
        type: Sequelize.STRING(50),
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

    await queryInterface.addConstraint('people', {
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
    await queryInterface.removeConstraint('people', 'people_album_id_albums_fk');
    await queryInterface.dropTable('people');
  }
};