'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('people_has_faces', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      people_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      image_path: {
        type: Sequelize.STRING(60),
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

    await queryInterface.addConstraint('people_has_faces', {
      fields: ['people_id'],
      type: 'foreign key',
      references: {
        table: 'people',
        field: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('people_has_faces');
  }
};