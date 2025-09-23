module.exports = (sequelize, Sequelize) => {
  const SaleMaterialQuoteItems = sequelize.define(
    "saleMaterialQuoteItems",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      material_quote_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      item: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      qty: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cost: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      margin: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      commission: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      price: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      total: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      uom: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      std_cost: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      list_price: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      onOrder: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      other1: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      requestedDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      warehouse: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      costPer: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      expectedDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      receivedToDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      openTotal: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      transferToWarehouse: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      origin: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      other2: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      discPct: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      extPrice: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      tax: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      region: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      taxCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return SaleMaterialQuoteItems;
};
