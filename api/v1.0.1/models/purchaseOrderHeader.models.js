module.exports = (sequelize, DataTypes) => {
  const purchaseOrderHeader = sequelize.define(
    "purchase_order_header",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      po_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      vendor_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      ship_to_warehouse_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM('DRAFT', 'SENT', 'PARTIALLY_RECEIVED','RECEIVED', 'CLOSED'),
        allowNull: true
      },
      order_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      expected_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      currency_code: {
        type: DataTypes.STRING(3),
        allowNull: true
      },
      exchange_rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
      },
      payment_terms_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      shipping_method_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      approval_status: {
        type: DataTypes.ENUM('PENDING', 'APPROVED'),
        allowNull: true,
        defaultValue: 'PENDING'
      },
      created_by_user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
     
     
    },
    {
      tableName: "purchase_order_header",
      timestamps: true,
      underscored: true
    }
  );

  return purchaseOrderHeader;
};
