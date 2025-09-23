module.exports = (sequelize, Sequelize) => {
    const takeOfQuotesItems = sequelize.define(
      "takeOfQuotesItems",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        quoteId: {
          type: Sequelize.INTEGER,
        },
        data: {
          type: Sequelize.JSONB,
        }
      },
      { timestamps: true, freezeTableName: true }
    );
    return takeOfQuotesItems;
  };
  