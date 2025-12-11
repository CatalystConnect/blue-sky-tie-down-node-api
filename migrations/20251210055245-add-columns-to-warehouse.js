'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

     await queryInterface.addColumn("Warehouse", "warehouse_code", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
     
    });

    await queryInterface.addColumn("Warehouse", "location", {
      type: Sequelize.STRING,
      allowNull: true,
      
    });

    await queryInterface.addColumn("Warehouse", "is_active", {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    
    });
    
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.removeColumn("Warehouse", "warehouse_code");
    await queryInterface.removeColumn("Warehouse", "location");
    await queryInterface.removeColumn("Warehouse", "is_active");
  }
};
