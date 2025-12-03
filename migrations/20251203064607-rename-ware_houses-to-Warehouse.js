'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameTable("ware_houses", "Warehouse"); 
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.renameTable("Warehouse", "ware_houses");
  }
};
