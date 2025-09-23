module.exports = (sequelize, Sequelize) => {
  const catalogVariations = sequelize.define(
    "catalogVariations",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      catalogId: {
        type: Sequelize.INTEGER,
      },
      image: {
        type: Sequelize.STRING,
      },
      thumbnail: {
        type: Sequelize.STRING,
      },
      data: {
        type: Sequelize.STRING(5000),
      }
    },
    { timestamps: true, freezeTableName: true }
  );
  return catalogVariations;
};
