'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable('po_receipt_line', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      receipt_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      po_line_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      received_qty: {
        type: Sequelize.DECIMAL,
        allowNull: true
      },
      lot_number: {
        type: Sequelize.STRING,
        allowNull: true
      },
      expiration_date: {
        type: Sequelize.DATEONLY,
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
   await queryInterface.dropTable('po_receipt_line');
  }
};
