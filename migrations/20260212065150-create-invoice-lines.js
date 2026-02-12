'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("invoice_lines", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      invoice_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        
      },

      receipt_line_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        
      },

      po_line_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
       
      },

      billed_qty: {
        type: Sequelize.DECIMAL(15, 3),
        allowNull: true,
      },

      unit_cost: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
      },

      gl_expense_acct: {
        type: Sequelize.INTEGER,
        allowNull: true,
        
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },

      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable("invoice_lines");
  }
};
