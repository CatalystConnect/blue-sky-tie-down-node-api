'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('PO_headers', {
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

      vendorName: {
        type: Sequelize.STRING,
        allowNull: true
      },

      email: {
        type: Sequelize.STRING,
        allowNull: true
      },

      primaryAttn: {
        type: Sequelize.STRING,
        allowNull: true
      },

      vendorOrder: {
        type: Sequelize.STRING,
        allowNull: true
      },

      externalPO: {
        type: Sequelize.STRING,
        allowNull: true
      },

      termsField: {
        type: Sequelize.STRING,
        allowNull: true
      },

      logistics: {
        type: Sequelize.STRING,
        allowNull: true
      },

      shippingAcct: {
        type: Sequelize.STRING,
        allowNull: true
      },

      ordered: {
        type: Sequelize.DATE,
        allowNull: true
      },

      incoterms: {
        type: Sequelize.STRING,
        allowNull: true
      },

      vesselReference: {
        type: Sequelize.STRING,
        allowNull: true
      },

      receiptDate: {
        type: Sequelize.DATE,
        allowNull: true
      },

      lastChange: {
        type: Sequelize.DATE,
        allowNull: true
      },

      shipped: {
        type: Sequelize.DATE,
        allowNull: true
      },

      jobProject: {
        type: Sequelize.STRING,
        allowNull: true
      },

      custPO: {
        type: Sequelize.STRING,
        allowNull: true
      },

      followUpDate: {
        type: Sequelize.DATE,
        allowNull: true
      },

      dateExpected: {
        type: Sequelize.DATE,
        allowNull: true
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },

      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },

  async down(queryInterface, Sequelize) {
   await queryInterface.dropTable('PO_headers');
  }
};
