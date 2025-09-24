module.exports = (sequelize, Sequelize) => {
    const brands = sequelize.define(
      "brands",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: Sequelize.INTEGER,
        },
        name: {
          type: Sequelize.STRING,
        },
      },
      { timestamps: true, freezeTableName: true }
    );
    return brands;
  };
  