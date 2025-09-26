module.exports = (sequelize, Sequelize) => {
  const purchaseHeaderTabs = sequelize.define(
    "purchase_header_tabs",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      purchase_order_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      primaryAtt: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      minBuyAmt: {
        type: Sequelize.DECIMAL(10, 0),
        allowNull: true
      },
      warehouse: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      termsCode: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      vendorContact: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      fax: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      jobProject: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      customerPO: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      vendorEmail: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      receiptDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      lastChange: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      shipped: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      followUpDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      dateExpected: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true,
      deletedAt: "deleted_at",
    }
  );

  return purchaseHeaderTabs;
};
