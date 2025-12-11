'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable('purchase_order_header', {
      id: {
         type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      po_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      vendor_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      ship_to_warehouse_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('DRAFT', 'SENT','PARTIALLY_RECEIVED', 'RECEIVED', 'CLOSED'),
        allowNull: true
      },
      order_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      expected_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      currency_code: {
        type: Sequelize.STRING(3),
        allowNull: true
      },
      exchange_rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      payment_terms_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      shipping_method_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      approval_status: {
        type: Sequelize.ENUM('PENDING', 'APPROVED'),
        allowNull: true,
        defaultValue: 'PENDING'
      },
      created_by_user_id: {
        type: Sequelize.INTEGER,
        allowNull: true
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('purchase_order_header');
  }
};
