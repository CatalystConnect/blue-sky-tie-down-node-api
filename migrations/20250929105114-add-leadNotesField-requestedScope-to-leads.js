'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('leads', 'leadNotesField', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('leads', 'requestedScope', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.removeColumn('leads', 'leadNotesField');
    await queryInterface.removeColumn('leads', 'requestedScope');
  }
};
