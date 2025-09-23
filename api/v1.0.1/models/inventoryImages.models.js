module.exports = (sequelize, Sequelize) => {
    const inventoryImages = sequelize.define(
      "inventoryImages",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        inventoryId: {
          type: Sequelize.INTEGER,
        },
        image: {
          type: Sequelize.STRING,
        }
      },
      { timestamps: true, freezeTableName: true }
    );
    return inventoryImages;
  };
  