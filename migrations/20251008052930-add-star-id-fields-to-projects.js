'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('projects', 'star_approval', {
      type: Sequelize.STRING,
      
    });
   
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.removeColumn('projects', 'star_approval');
  }
};
