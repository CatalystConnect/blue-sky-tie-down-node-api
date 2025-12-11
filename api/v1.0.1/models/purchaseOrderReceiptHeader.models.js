module.exports = (sequelize, DataTypes) => {
  const purchaseOrderReceiptHeader = sequelize.define(
    "po_receipt_header",
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
      warehouse_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      receipt_number: {
        type: DataTypes.STRING,
        allowNull: true
      },
      vendor_packing_slip: {
        type: DataTypes.STRING,
        allowNull: true
      },
      received_at: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      posted_to_gl: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
    },
    {
      tableName: "po_receipt_header",
      timestamps: true,
       underscored: true
    }
  );

  return purchaseOrderReceiptHeader;
};
