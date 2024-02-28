'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('albums', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      name: {
        type: Sequelize.STRING(80),
        allowNull: true
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
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

    await queryInterface.addConstraint('albums', {
      fields: ['user_id'],
      type: 'foreign key',
      references: {
        table: 'users',
        field: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('albums', 'albums_user_id_users_fk');
    await queryInterface.dropTable('albums');
  }
};