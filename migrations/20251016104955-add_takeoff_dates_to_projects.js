'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.addColumn('projects', 'takeoffDueDate', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('projects', 'takeoffStartDate', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {

   await queryInterface.removeColumn('projects', 'takeoffDueDate');
   await queryInterface.removeColumn('projects', 'takeoffStartDate');
   
  }
};
