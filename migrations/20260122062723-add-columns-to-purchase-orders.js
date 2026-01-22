'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('purchase_orders', 'poNumber', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('purchase_orders', 'vendorName', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('purchase_orders', 'vendorAddress', {
      type: Sequelize.TEXT,
      allowNull: true
    });
    await queryInterface.addColumn('purchase_orders', 'shipToId', {
      type: Sequelize.BIGINT,
      allowNull: true
    });
    await queryInterface.addColumn('purchase_orders', 'shippingMethod', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('purchase_orders', 'orderClass', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('purchase_orders', 'cancelDate', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('purchase_orders', 'poNumber');
    await queryInterface.removeColumn('purchase_orders', 'vendorName');
    await queryInterface.removeColumn('purchase_orders', 'vendorAddress');
    await queryInterface.removeColumn('purchase_orders', 'shipToId');
    await queryInterface.removeColumn('purchase_orders', 'shippingMethod');
    await queryInterface.removeColumn('purchase_orders', 'orderClass');
    await queryInterface.removeColumn('purchase_orders', 'cancelDate');
  }
};
