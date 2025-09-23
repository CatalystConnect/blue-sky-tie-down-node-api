module.exports = (sequelize, Sequelize) => {
    const leadInteraction = sequelize.define(
      "leadInteraction",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        contractId: {
          type: Sequelize.INTEGER,
        },
        date: {
          type: Sequelize.STRING,
        },
        interactionType: {
          type: Sequelize.STRING,
        },
        notes: {
          type: Sequelize.TEXT,
        }
      },
      { timestamps: true, freezeTableName: true }
    );
    return leadInteraction;
  };
  