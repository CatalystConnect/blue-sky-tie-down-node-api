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
      safety_stock: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      usage_months: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      classification: {
        type: DataTypes.ENUM('A', 'B', 'C'),
        allowNull: true,
      },

      class_by_hits: {
        type: DataTypes.ENUM('A', 'B', 'C'),
        allowNull: true,
      },

      purchase_multiple: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      purchase_minimum: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      avg_monthly_usage: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },

      trans_avg_mult: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: true,
      },

      last_warning_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      replacement_r_cost: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
      },

      carrying_k_cost: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: true,
      },

      calendar_year_hits: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      last_12_month_hits: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      calculation_method: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      min_mult: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      max_mult: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      min_max_mode: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      eoq: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      order_point: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      line_point: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      warn_qty: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      last_cost_new: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
      },

      cost_per: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      working_cost_new: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
      },

      costing_method: {
        type: DataTypes.ENUM('FIFO', 'LIFO', 'AVERAGE', 'STANDARD'),
        allowNull: true,
      },

      land_working_cost: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
      },

      land_last_cost: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
      },

      land_avg_cost: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
      },

      current_cost_difference: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
      },
    },
    {
      tableName: "warehouse_item",
      timestamps: true,
    }
  );

  return WarehouseItem;
};
