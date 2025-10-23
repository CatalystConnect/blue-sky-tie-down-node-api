"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("projects", "work_hours", {
      type: Sequelize.STRING, 
      allowNull: true,
      
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('projects', 'work_hours');
  },
};
