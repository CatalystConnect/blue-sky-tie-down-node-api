'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('projects', 'plan_link', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('projects', 'submissionType', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('projects', 'planFiles', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('projects', 'plan_link');
    await queryInterface.removeColumn('projects', 'submissionType');
    await queryInterface.removeColumn('projects', 'planFiles');
  }
};
