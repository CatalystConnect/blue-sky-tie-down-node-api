'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('material_quote_items', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      material_quote_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      item: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      qty: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      cost: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      margin: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      commission: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      price: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      total: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      uom: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      std_cost: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      list_price: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      onOrder: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      bo: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      other1: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      requestedDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      warehouse: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      costPer: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      expectedDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      receivedToDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      openTotal: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      transferToWarehouse: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      origin: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      other2: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      discPct: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('material_quote_items');
  }
};
