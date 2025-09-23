module.exports = (sequelize, Sequelize) => {
    const token = sequelize.define(
      "token",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        token: {
          type: Sequelize.STRING,
        }
      },
      { timestamps: true, freezeTableName: true }
    );
    return token;
  };
  