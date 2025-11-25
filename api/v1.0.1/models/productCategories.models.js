module.exports = (sequelize, Sequelize) => {
    const productCategories = sequelize.define(
      "product_categories",
      {
        id: {
          type: Sequelize.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: Sequelize.BIGINT,
          allowNull: true,
        },
        name: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        created_at: {
          type: Sequelize.DATE,
        },
        updated_at: {
          type: Sequelize.DATE,
        },
        deleted_at: {
          type: Sequelize.DATE,
        },
      },
      {
        timestamps: true,        
        createdAt: "created_at",
        updatedAt: "updated_at",
        paranoid: true,         
        deletedAt: "deleted_at",
        freezeTableName: true,  
             
      }
    );
  
    return productCategories;
  };
  