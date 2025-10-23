'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.addColumn("gDriveAssociation", "file_name", {
      type: Sequelize.STRING,
      allowNull: true,
      after: "drive_id", 
    });
  },

  async down (queryInterface, Sequelize) {
       await queryInterface.removeColumn("gDriveAssociation", "file_name");

  }
};
