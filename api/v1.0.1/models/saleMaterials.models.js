module.exports = (sequelize, Sequelize) => {
    const SaleMaterials = sequelize.define(
      "saleMaterials",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        user_id: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        item: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        description: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        brand: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        qty: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        cost: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        total: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        hardware_type: {
          type: Sequelize.STRING,
          allowNull: true,
        },
      },
      {
        timestamps: true,
        freezeTableName: true,
        paranoid: true,         
        createdAt: "created_at",
        updatedAt: "updated_at",
        deletedAt: "deleted_at",
      }
    );
  
    return SaleMaterials;
  };
  