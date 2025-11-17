'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.addColumn('project_plan_sets', 'workflow_status', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
      
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('project_plan_sets', 'workflow_status');
  }
};
