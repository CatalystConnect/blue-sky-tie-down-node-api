'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('gDriveAssociation', 'type', {
      type: Sequelize.STRING, 
      allowNull: false,
      defaultValue: 'file', 
    });

    await queryInterface.addColumn('gDriveAssociation', 'parent', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0, 
    });
  },


  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('gDriveAssociation', 'type');
    await queryInterface.removeColumn('gDriveAssociation', 'parent');
  }
};
