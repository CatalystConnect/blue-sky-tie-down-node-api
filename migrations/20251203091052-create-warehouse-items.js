'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('warehouse_item', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      warehouse_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      sku: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      allow_sales: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      allow_purchasing: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      allow_transfers_out: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      allow_transfers_in: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      replenishment_method: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      primary_vendor_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      notes: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      // Optional: You can add any extra columns from your list if needed
      itemNumber: { type: Sequelize.STRING, allowNull: true },
      description: { type: Sequelize.STRING, allowNull: true },
      date: { type: Sequelize.DATE, allowNull: true },
      contractor_id: { type: Sequelize.INTEGER, allowNull: true },
      per: { type: Sequelize.STRING, allowNull: true },
      listPrice: { type: Sequelize.STRING, allowNull: true },
      fullList: { type: Sequelize.STRING, allowNull: true },
      fullRetail: { type: Sequelize.STRING, allowNull: true },
      unitCost: { type: Sequelize.STRING, allowNull: true },
      effectiveDate: { type: Sequelize.DATE, allowNull: true },
      costPerEA: { type: Sequelize.STRING, allowNull: true },
      stdCost: { type: Sequelize.STRING, allowNull: true },
      fullStd: { type: Sequelize.STRING, allowNull: true },
      average: { type: Sequelize.STRING, allowNull: true },
      lastAvg: { type: Sequelize.STRING, allowNull: true },
      lastLand: { type: Sequelize.STRING, allowNull: true },
      baseCost: { type: Sequelize.STRING, allowNull: true },
      onHand: { type: Sequelize.STRING, allowNull: true },
      committed: { type: Sequelize.STRING, allowNull: true },
      available: { type: Sequelize.STRING, allowNull: true },
      triRegOut: { type: Sequelize.STRING, allowNull: true },
      triTotalOut: { type: Sequelize.STRING, allowNull: true },
      backorder: { type: Sequelize.STRING, allowNull: true },
      rented: { type: Sequelize.STRING, allowNull: true },
      onPO: { type: Sequelize.STRING, allowNull: true },
      tranRegIn: { type: Sequelize.STRING, allowNull: true },
      tranTotalIn: { type: Sequelize.STRING, allowNull: true },
      webAllow: { type: Sequelize.STRING, allowNull: true },
      qtyAvail: { type: Sequelize.STRING, allowNull: true },
      workOrder: { type: Sequelize.STRING, allowNull: true },
      shipping: { type: Sequelize.STRING, allowNull: true },
      receiving: { type: Sequelize.STRING, allowNull: true },
      allow: { type: Sequelize.STRING, allowNull: true },
      uM: { type: Sequelize.STRING, allowNull: true },
      buyerType: { type: Sequelize.STRING, allowNull: true },
      replenishPath: { type: Sequelize.STRING, allowNull: true },
      seasonal: { type: Sequelize.STRING, allowNull: true },
      safetyStock: { type: Sequelize.STRING, allowNull: true },
      minQty: { type: Sequelize.STRING, allowNull: true },
      maxQty: { type: Sequelize.STRING, allowNull: true },
      leadTime: { type: Sequelize.STRING, allowNull: true },
      reorderPoint: { type: Sequelize.STRING, allowNull: true },
      standardCost: { type: Sequelize.STRING, allowNull: true },
      lastCost: { type: Sequelize.STRING, allowNull: true },
      averageCost: { type: Sequelize.STRING, allowNull: true },
      workingCost: { type: Sequelize.STRING, allowNull: true },
      costAdditions: { type: Sequelize.STRING, allowNull: true },
    });

    await queryInterface.addConstraint('warehouse_item', {
      fields: ['warehouse_id', 'item_id'],
      type: 'unique',
      name: 'unique_warehouse_item'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('warehouse_item');
  }
};
