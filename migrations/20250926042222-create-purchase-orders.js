'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("purchase_orders", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      vendor_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      shipDetail: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      warehouse: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      warehouse_address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      dropShip_address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      customerPo: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      orderType: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      qty_ordered: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      wanted: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      dateOrdered: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      enteredBy: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP"
        ),
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("purchase_orders");
  }
};
