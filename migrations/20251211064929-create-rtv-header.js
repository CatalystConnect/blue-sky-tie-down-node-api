'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable('rtv_header', {
     id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      rtv_number: {
        type: Sequelize.STRING,
        allowNull: false
      },
      original_po_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        
      },
      vendor_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      vendor_rma: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('DRAFT', 'SHIPPED', 'CLOSED'),
        allowNull: false,
        defaultValue: 'DRAFT'
      },
      total_credit_amount: {
        type: Sequelize.DECIMAL,
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('rtv_header');
  }
};
