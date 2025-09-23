module.exports = (sequelize, Sequelize) => {
    const materialQuotes = sequelize.define(
      "materialQuotes",
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
        },
        notes: {
          type: Sequelize.STRING,
        },
        item: {
          type: Sequelize.STRING,
        },
        lineType: {
          type: Sequelize.STRING,
        },
        uom: {
          type: Sequelize.STRING,
        },
        taxable: {
          type: Sequelize.BOOLEAN,
        },
        margin: {
          type: Sequelize.STRING,
        }
      },
      { timestamps: true, freezeTableName: true }
    );
    return materialQuotes;
  };
  