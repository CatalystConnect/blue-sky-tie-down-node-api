module.exports = (sequelize, Sequelize) => {
    const contractorRegion = sequelize.define(
      "contractorRegion",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        regionName: {
            type: Sequelize.STRING,
        },
        associateZipCode: {
          type: Sequelize.JSONB,
        }
      },
      { timestamps: true, freezeTableName: true }
    );
    return contractorRegion;
  };
  