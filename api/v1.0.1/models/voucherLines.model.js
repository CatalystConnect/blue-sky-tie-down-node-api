module.exports = (sequelize, Sequelize) => {
  const voucherLines = sequelize.define(
    "voucher_lines",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      voucher_id: {
        type: Sequelize.INTEGER,
        allowNull: false,

      },

      line_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      po_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      po_line_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      item_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      revision_seq: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      qty_received: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
      },

      qty_invoiced: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
      },

      unit_of_measure: {
        type: Sequelize.STRING,
        allowNull: true, // EA
      },

      received_cost: {
        type: Sequelize.DECIMAL(15, 4),
        defaultValue: 0,
      },

      invoiced_cost: {
        type: Sequelize.DECIMAL(15, 4),
        defaultValue: 0,
      },

      extension_amount: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
      },

      commodity_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

    },
    {
      timestamps: true,
      freezeTableName: true,
      // paranoid: true,

    }
  );
  return voucherLines;
};
