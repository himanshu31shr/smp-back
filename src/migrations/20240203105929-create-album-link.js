'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('album_links', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      album_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      access_type: {
        type: Sequelize.TINYINT(1),
        defaultValue: 0,
        comment: "0:Protected;1:Full_Access"
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

    await queryInterface.addConstraint('album_links', {
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
    await queryInterface.removeConstraint('album_links', 'album_links_album_id_albums_fk');
    await queryInterface.dropTable('album_links');
  }
};