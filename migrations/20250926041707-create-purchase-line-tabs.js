'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable('purchase_line_tabs', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      purchase_order_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      line: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      item: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      uom: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      unit_cost: {
        type: Sequelize.DECIMAL(10,4),
        allowNull: true
      },
      ordered_ext: {
        type: Sequelize.DECIMAL(10,4),
        allowNull: true
      },
      onOrder: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      bo: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      other: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      reqDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      orderTotal: {
        type: Sequelize.DECIMAL(10,4),
        allowNull: true
      },
      wareHouse: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      costPer: {
        type: Sequelize.DECIMAL(10,4),
        allowNull: true
      },
      other1: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      exptDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      receToDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      other2: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      openTotal: {
        type: Sequelize.DECIMAL(10,4),
        allowNull: true
      },
      transfer: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      origin: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      other3: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      discpt: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      term: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      unit: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      unitPrice: {
        type: Sequelize.DECIMAL(10,4),
        allowNull: true
      },
      unit2: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      poNumber: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      poLine: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      voucher: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      qtyYtd: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      purchYtd: {
        type: Sequelize.DECIMAL(10,4),
        allowNull: true
      },
      qtyMtd: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      purchMtd: {
        type: Sequelize.DECIMAL(10,4),
        allowNull: true
      },
      qtyLyr: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      purchLyr: {
        type: Sequelize.DECIMAL(10,4),
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('purchase_line_tabs');
  }
};
