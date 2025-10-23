'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('gDriveAssociation', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      parent: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      module: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      module_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      drive_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
        
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('gDriveAssociation');
  }
};
