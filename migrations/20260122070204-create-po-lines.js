'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable('po_lines', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },

      poId: {  
        type: Sequelize.INTEGER,
        allowNull: true
      },

      lineNumber: {
        type: Sequelize.STRING,
        allowNull: true
      },

      item: {
        type: Sequelize.STRING,
        allowNull: true
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      orderedQty: {
        type: Sequelize.INTEGER,
        allowNull: true
      },

      uom: {
        type: Sequelize.STRING,
        allowNull: true
      },

      unitCost: {
        type: Sequelize.FLOAT,
        allowNull: true
      },

      orderedExt: {
        type: Sequelize.FLOAT,
        allowNull: true
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },

      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('po_lines');
  }
};
