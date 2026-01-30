'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('warehouse_item', 'effectiveDate', {
      type: Sequelize.DATEONLY,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('warehouse_item', 'effectiveDate', {
      type: Sequelize.DATE,
      allowNull: true
    });
  }
};
