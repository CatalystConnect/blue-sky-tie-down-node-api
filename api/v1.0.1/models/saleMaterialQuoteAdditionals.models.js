module.exports = (sequelize, Sequelize) => {
    const SaleMaterialQuoteAdditionals = sequelize.define(
      "saleMaterialQuoteAdditionals",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        material_quote_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        item: {
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
        margin: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        commission: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        price: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        total: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        notes: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        description: {
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
  
    return SaleMaterialQuoteAdditionals;
  };
  