module.exports = (sequelize, Sequelize) => {
    const configureAttribute = sequelize.define(
      "configureAttribute",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        attributeId: {
            type: Sequelize.INTEGER,
          },
        name: {
          type: Sequelize.STRING,
        },
        slug: {
          type: Sequelize.STRING,
        },
        description: {
            type: Sequelize.TEXT,
          },
      },
      { timestamps: true, freezeTableName: true }
    );
    return configureAttribute;
  };
  