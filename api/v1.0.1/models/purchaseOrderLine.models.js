module.exports = (sequelize, DataTypes) => {
  const purchaseOrderLine = sequelize.define(
    "purchase_order_line",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
       po_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      item_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      vendor_item_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      ordered_qty: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      uom_code: {
        type: DataTypes.STRING,
        allowNull: true
      },
      conversion_factor: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      stock_qty: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      unit_cost: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      extended_cost: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      received_qty: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: 0
      },
      is_closed: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      pricing_source: {
        type: DataTypes.ENUM('PROMO', 'CONTRACT', 'BASE'),
        allowNull: true
      },
     
    },
    {
      tableName: "purchase_order_line",
      timestamps: true,
      underscored: true
    }
  );

  return purchaseOrderLine;
};
