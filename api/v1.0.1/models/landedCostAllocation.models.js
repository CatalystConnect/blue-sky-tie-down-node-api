module.exports = (sequelize, DataTypes) => {
  const landedCostAllocation = sequelize.define(
    "landed_cost_allocation",
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
      cost_type: {
        type: DataTypes.ENUM('FREIGHT', 'DUTY', 'TAX'),
        allowNull: true
      },
      amount: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      allocation_method: {
        type: DataTypes.ENUM('VALUE', 'WEIGHT', 'QTY'),
        allowNull: true
      },
      gl_reference: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
     
    },
    {
      tableName: "landed_cost_allocation",
      timestamps: true,
    }
  );

  return landedCostAllocation;
};
