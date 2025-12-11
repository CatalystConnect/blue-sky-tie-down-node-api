'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable('po_receipt_header', {
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
      warehouse_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      receipt_number: {
        type: Sequelize.STRING,
        allowNull: true
      },
      vendor_packing_slip: {
        type: Sequelize.STRING,
        allowNull: true
      },
      received_at: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      posted_to_gl: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
    await queryInterface.dropTable('po_receipt_header');
  }
};
