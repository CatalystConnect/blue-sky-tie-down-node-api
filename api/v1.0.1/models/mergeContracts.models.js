module.exports = (sequelize, Sequelize) => {
    const mergeContracts = sequelize.define(
      "mergeContracts",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        parentContractId: {
          type: Sequelize.INTEGER,
        },
        childContractId: {
          type: Sequelize.INTEGER,
        },
        childContractData: {
          type: Sequelize.JSONB,
        }
      },
      { timestamps: true, freezeTableName: true }
    );
    return mergeContracts;
  };
  