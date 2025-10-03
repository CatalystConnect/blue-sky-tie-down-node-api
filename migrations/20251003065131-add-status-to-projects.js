'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   return queryInterface.addColumn('projects', 'status', {
      type: Sequelize.STRING, 
      allowNull: true,      
      
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn('projects', 'status');
  }
};
