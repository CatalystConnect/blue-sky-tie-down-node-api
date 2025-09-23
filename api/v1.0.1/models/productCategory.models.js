module.exports = (sequelize, Sequelize) => {
  const productCategory = sequelize.define(
    "productCategory",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
      },
      slug: {
        type: Sequelize.STRING,
      },
      parentCategory: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      image: {
        type: Sequelize.STRING,
      },
      goodProduct: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      betterProduct: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      bestProduct: {
        type: Sequelize.INTEGER,
        allowNull: true,
      }
    },
    { timestamps: true, freezeTableName: true }
  );
  return productCategory;
};
