module.exports = (sequelize, DataTypes) => {
    const GeneratedContractors = sequelize.define(
      "GeneratedContractors",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        lead_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        sale_material_quotes_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        contractor_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        status: {
          type: DataTypes.STRING, 
          allowNull: false,
          defaultValue: "pending",
        },
      },
      {
        tableName: "generatedContractors",
        timestamps: true, 
      }
    );
    return GeneratedContractors;
  };
  