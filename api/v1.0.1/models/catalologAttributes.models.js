module.exports = (sequelize, Sequelize) => {
    const catalogAttribute = sequelize.define(
      "catalogAttribute",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        catalogId: {
          type: Sequelize.INTEGER,
        },
        attributeData: {
          type: Sequelize.JSONB,
        }
      },
      { timestamps: true, freezeTableName: true }
    );
    return catalogAttribute;
  };
  