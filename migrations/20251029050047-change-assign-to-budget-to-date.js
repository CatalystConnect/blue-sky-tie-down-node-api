'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('projects', 'assign_to_budget', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('projects', 'assign_to_budget', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
