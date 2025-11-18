'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.addColumn('project_plan_sets', 'newDueDate', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('project_plan_sets', 'newDueDate');
  }
};
