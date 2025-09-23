module.exports = (sequelize, Sequelize) => {
    const SaleMaterialQuoteHeaderTabs = sequelize.define(
      "saleMaterialQuoteHeaderTabs",
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
        terms_code: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        tax_code: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        order_by: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        phone: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        price_by: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        warehouse: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        sales1: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        finances_type: {
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
  
    return SaleMaterialQuoteHeaderTabs;
  };
  