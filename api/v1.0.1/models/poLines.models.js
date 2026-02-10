module.exports = (sequelize, DataTypes) => {
  const poLine = sequelize.define(
    'po_lines',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      poId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      lineNumber: DataTypes.STRING,
      item: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      orderedQty: DataTypes.INTEGER,
      uom: DataTypes.STRING,
      unitCost: DataTypes.FLOAT,
      orderedExt: DataTypes.FLOAT,
      deletedAt: DataTypes.DATE,
      received_qty: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: 'po_lines',
      timestamps: true,
      paranoid: true,
      // underscored: true
    }
  );

  return poLine;
};
