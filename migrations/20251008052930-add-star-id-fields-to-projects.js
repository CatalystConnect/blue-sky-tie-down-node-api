'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('projects', 'priority', {
      type: Sequelize.STRING,
      
    });
   
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.removeColumn('projects', 'priority');
  }
};
