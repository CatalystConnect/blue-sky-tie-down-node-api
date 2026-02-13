'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('voucher_headers', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      voucher_number: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      voucher_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      vendor_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      vendor_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
      },
      amount_in_words: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      voucher_description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      on_check: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      approved_by: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      discount_amount: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
      },

      term_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      due_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      invoice_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      total_amount: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      account_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      exchange_rate: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      foreign_currency: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      po_number: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      po_add_amount: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
      },
      invoice_gross: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
      },

      status: {
        type: Sequelize.STRING,
        defaultValue: 'Draft',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('voucher_headers');
  }
};
