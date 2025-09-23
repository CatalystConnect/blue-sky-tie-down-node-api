module.exports = (sequelize, Sequelize) => {
    const productAttribute = sequelize.define(
      "productAttribute",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        productId: {
          type: Sequelize.INTEGER,
        },
        name: {
          type: Sequelize.STRING,
        },
        value: {
            type: Sequelize.STRING,
          }
      },
      { timestamps: true, freezeTableName: true }
    );
    return productAttribute;
  };
  