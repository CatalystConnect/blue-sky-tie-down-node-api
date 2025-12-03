module.exports = (sequelize, DataTypes) => {
    const WarehouseItem = sequelize.define(
      "WarehouseItem",
      {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      warehouse_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sku: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      allow_sales: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      allow_purchasing: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      allow_transfers_out: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      allow_transfers_in: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      replenishment_method: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      primary_vendor_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      itemNumber: DataTypes.STRING,
      description: DataTypes.STRING,
      date: DataTypes.DATE,
      contractor_id: DataTypes.INTEGER,
      per: DataTypes.STRING,
      listPrice: DataTypes.STRING,
      fullList: DataTypes.STRING,
      fullRetail: DataTypes.STRING,
      unitCost: DataTypes.STRING,
      effectiveDate: DataTypes.DATE,
      costPerEA: DataTypes.STRING,
      stdCost: DataTypes.STRING,
      fullStd: DataTypes.STRING,
      average: DataTypes.STRING,
      lastAvg: DataTypes.STRING,
      lastLand: DataTypes.STRING,
      baseCost: DataTypes.STRING,
      onHand: DataTypes.STRING,
      committed: DataTypes.STRING,
      available: DataTypes.STRING,
      triRegOut: DataTypes.STRING,
      triTotalOut: DataTypes.STRING,
      backorder: DataTypes.STRING,
      rented: DataTypes.STRING,
      onPO: DataTypes.STRING,
      tranRegIn: DataTypes.STRING,
      tranTotalIn: DataTypes.STRING,
      webAllow: DataTypes.STRING,
      qtyAvail: DataTypes.STRING,
      workOrder: DataTypes.STRING,
      shipping: DataTypes.STRING,
      receiving: DataTypes.STRING,
      allow: DataTypes.STRING,
      uM: DataTypes.STRING,
      buyerType: DataTypes.STRING,
      replenishPath: DataTypes.STRING,
      seasonal: DataTypes.STRING,
      safetyStock: DataTypes.STRING,
      minQty: DataTypes.STRING,
      maxQty: DataTypes.STRING,
      leadTime: DataTypes.STRING,
      reorderPoint: DataTypes.STRING,
      standardCost: DataTypes.STRING,
      lastCost: DataTypes.STRING,
      averageCost: DataTypes.STRING,
      workingCost: DataTypes.STRING,
      costAdditions: DataTypes.STRING,
    },
    {
      tableName: "warehouse_item", 
      timestamps: true,
    }
    );
  
    return WarehouseItem;
  };
  