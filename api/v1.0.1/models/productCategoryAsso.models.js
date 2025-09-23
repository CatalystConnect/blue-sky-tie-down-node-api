module.exports = (sequelize, Sequelize) => {
    const productCategoryAssociation = sequelize.define(
      "productCategoryAssociation",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        productId: {
          type: Sequelize.INTEGER,
        },
        categoryId: {
          type: Sequelize.INTEGER,
        }
      },
      { timestamps: true, freezeTableName: true }
    );
    return productCategoryAssociation;
  };
  