'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.renameColumn('gDriveAssociation', 'parent', 'project_id');
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.renameColumn('gDriveAssociation', 'project_id', 'parent');
  }
};
