module.exports = (sequelize, Sequelize) => {
    const additionalQuotes = sequelize.define(
      "additionalQuotes",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        materialId: {
          type: Sequelize.INTEGER,
        },
        description: {
          type: Sequelize.STRING,
        },
        quantity: {
          type: Sequelize.STRING,
        },
        cost: {
          type: Sequelize.STRING,
        },
        price: {
          type: Sequelize.STRING,
        },
        total: {
          type: Sequelize.STRING,
        }
      },
      { timestamps: true, freezeTableName: true }
    );
    return additionalQuotes;
  };
  