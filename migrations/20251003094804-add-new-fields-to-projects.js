'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("projects", "takeofCompleteDate", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn("projects", "connectplan", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("projects", "surveyorNotes", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("projects", "completedFiles", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("projects", "takeOfEstimateTime", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("projects", "takeofCompleteDate");
    await queryInterface.removeColumn("projects", "connectplan");
    await queryInterface.removeColumn("projects", "surveyorNotes");
    await queryInterface.removeColumn("projects", "completedFiles");
    await queryInterface.removeColumn("projects", "takeOfEstimateTime");
  }
};
