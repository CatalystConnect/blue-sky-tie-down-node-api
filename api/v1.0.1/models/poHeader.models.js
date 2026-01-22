module.exports = (sequelize, DataTypes) => {
  const poHeader = sequelize.define(
    "PO_headers",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      poId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },

      vendorName: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      primaryAttn: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      vendorOrder: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      externalPO: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      termsField: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      logistics: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      shippingAcct: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      ordered: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      incoterms: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      vesselReference: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      receiptDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      lastChange: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      shipped: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      jobProject: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      custPO: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      followUpDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      dateExpected: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      
     
     
    },
    {
      tableName: "PO_headers",
      timestamps: true,
      // underscored: true
    }
  );

  return poHeader;
};
