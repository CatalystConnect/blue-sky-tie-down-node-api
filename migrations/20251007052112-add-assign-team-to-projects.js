'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
   
    await queryInterface.addColumn('projects', 'takeoff_status', {
      type: Sequelize.STRING,
      allowNull: true,
     
    });
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.removeColumn('projects', 'takeoff_status');
  }
};
