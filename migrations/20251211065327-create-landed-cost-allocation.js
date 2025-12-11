'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('landed_cost_allocation', {
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
      cost_type: {
        type: Sequelize.ENUM('FREIGHT', 'DUTY', 'TAX'),
        allowNull: true
      },
      amount: {
        type: Sequelize.DECIMAL,
        allowNull: true
      },
      allocation_method: {
        type: Sequelize.ENUM('VALUE', 'WEIGHT', 'QTY'),
        allowNull: true
      },
      gl_reference: {
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('landed_cost_allocation');
  }
};
