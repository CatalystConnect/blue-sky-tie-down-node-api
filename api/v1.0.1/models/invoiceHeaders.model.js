module.exports = (sequelize, Sequelize) => {
  const invoiceHeaders = sequelize.define(
    "invoice_headers",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      vendor_id: {
        type: Sequelize.INTEGER,
        allowNull: true,

      },

      vendor_invoice_num: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      invoice_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },

      due_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },

      invoice_total: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
      },

      match_status: {
        type: Sequelize.STRING,
        allowNull: true,

      },

      payment_status: {
        type: Sequelize.STRING,
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

    },
    {
      timestamps: true,
      freezeTableName: true,
      paranoid: true,
     
    }
  );
  return invoiceHeaders;
};
