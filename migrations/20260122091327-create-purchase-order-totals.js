'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable("purchase_order_totals", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      poId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      
      minimumBuyAmount: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      },

   
      receivedGross: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      },
      invoicedGross: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      },
      openGross: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      },

      
      totalAddOns: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      },
      poTotal: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      },

    
      totalPieces: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      totalWeight: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      },
      totalCubes: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      },

      
      itemAddOns: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      },
      landedCost: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      },
      totalList: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      },

      
      orderedQty: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      orderedWeight: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      },
      orderedCubes: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      },

      receivedQty: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  

  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable("purchase_order_totals");
  }
};
