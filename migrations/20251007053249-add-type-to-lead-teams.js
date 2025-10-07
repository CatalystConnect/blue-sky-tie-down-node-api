'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('lead_teams', 'team_type', {
      type: Sequelize.STRING, 
      allowNull: true,       
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('lead_teams', 'team_type');
  }
};
