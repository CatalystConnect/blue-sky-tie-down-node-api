'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("po_receipt_line", "po_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn(
      "po_receipt_line",
      "purchase_order_item_id",
      {
        type: Sequelize.INTEGER,
        allowNull: true,
      }
    );

    await queryInterface.addColumn(
      "po_receipt_line",
      "warehouse_item_id",
      {
        type: Sequelize.INTEGER,
        allowNull: true,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("po_receipt_line", "po_id");
    await queryInterface.removeColumn(
      "po_receipt_line",
      "purchase_order_item_id"
    );
    await queryInterface.removeColumn(
      "po_receipt_line",
      "warehouse_item_id"
    );
  }
};
