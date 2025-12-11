module.exports = (sequelize, DataTypes) => {
  const rtvHeader = sequelize.define(
    "rtv_header",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      rtv_number: {
        type: DataTypes.STRING,
        allowNull: false
      },
      original_po_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        
      },
      vendor_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      vendor_rma: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM('DRAFT', 'SHIPPED', 'CLOSED'),
        allowNull: false,
        defaultValue: 'DRAFT'
      },
      total_credit_amount: {
        type: DataTypes.DECIMAL,
        allowNull: false
      },
     
    },
    {
      tableName: "rtv_header",
      timestamps: true,
    }
  );

  return rtvHeader;
};
