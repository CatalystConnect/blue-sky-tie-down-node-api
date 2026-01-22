module.exports = (sequelize, DataTypes) => {
  const PurchaseOrderTotals = sequelize.define(
    "purchase_order_totals",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      poId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      // Purchase Requirements
      minimumBuyAmount: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
      },

      // Gross
      receivedGross: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
      },
      invoicedGross: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
      },
      openGross: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
      },

      // Totals
      totalAddOns: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
      },
      poTotal: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
      },

      // Pieces / Weight / Cubes
      totalPieces: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      totalWeight: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
      },
      totalCubes: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
      },

      // Financial Summary
      itemAddOns: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
      },
      landedCost: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
      },
      totalList: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
      },

      // Quantity Breakdown
      orderedQty: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      orderedWeight: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
      },
      orderedCubes: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
      },

      receivedQty: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "purchase_order_totals",
      timestamps: true,
      // underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return PurchaseOrderTotals;
};
