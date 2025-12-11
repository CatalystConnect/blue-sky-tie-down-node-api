'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('purchase_order_line', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      po_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      vendor_item_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      ordered_qty: {
        type: Sequelize.DECIMAL,
        allowNull: true
      },
      uom_code: {
        type: Sequelize.STRING,
        allowNull: true
      },
      conversion_factor: {
        type: Sequelize.DECIMAL,
        allowNull: true
      },
      stock_qty: {
        type: Sequelize.DECIMAL,
        allowNull: true
      },
      unit_cost: {
        type: Sequelize.DECIMAL(19, 4),
        allowNull: true
      },
      extended_cost: {
        type: Sequelize.DECIMAL,
        allowNull: true
      },
      received_qty: {
        type: Sequelize.DECIMAL,
        allowNull: true,
        defaultValue: 0
      },
      is_closed: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      pricing_source: {
        type: Sequelize.ENUM('PROMO', 'CONTRACT', 'BASE'),
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('purchase_order_line');
  }
};
