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
        webAllow: {
          type: DataTypes.STRING,
        },
        qtyAvail: DataTypes.STRING,
        workOrder: DataTypes.STRING,
        shipping: DataTypes.STRING,
        receiving: DataTypes.STRING,
        allow: {
          type: DataTypes.STRING,
          
        },
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
        tableName: "warehouseItems",
        timestamps: true,   
        
      }
    );
  
    return WarehouseItem;
  };
  