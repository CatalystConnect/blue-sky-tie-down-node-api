module.exports = (sequelize, DataTypes) => {
  const purchaseOrderReceiptLine = sequelize.define(
    "po_receipt_line",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      receipt_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      po_line_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      item_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      received_qty: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      lot_number: {
        type: DataTypes.STRING,
        allowNull: true
      },
      expiration_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
        po_id: { 
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      purchase_order_item_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      warehouse_item_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      }
     
    },
    {
      tableName: "po_receipt_line",
      timestamps: true,
      underscored: true
    }
  );

  return purchaseOrderReceiptLine;
};
