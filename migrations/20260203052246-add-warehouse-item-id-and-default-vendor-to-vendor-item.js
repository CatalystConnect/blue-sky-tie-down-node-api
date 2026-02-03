'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('vendor_item', 'warehouse_item_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
     await queryInterface.addColumn('vendor_item', 'default_vendor', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('vendor_item', 'warehouse_item_id');
    await queryInterface.removeColumn('vendor_item', 'default_vendor');
  }
};
