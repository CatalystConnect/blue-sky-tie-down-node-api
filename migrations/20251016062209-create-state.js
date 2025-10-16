'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('state', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created_at: {
        allowNull: true,
        type: Sequelize.DATE,
       
      },
      updated_at: {
        allowNull: true,
        type: Sequelize.DATE,
        
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('state');
  }
};
