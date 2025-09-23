module.exports = (sequelize, Sequelize) => {
    const SaleMaterialQuotes = sequelize.define(
      "saleMaterialQuotes",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        user_id: 
        { 
            type: Sequelize.INTEGER, 
            allowNull: true 
        },
        contractor_id: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        enteredBy: {
          type: Sequelize.STRING,
          allowNull: true
        },
        shipDetail: {
          type: Sequelize.STRING,
          allowNull: true
        },
        dateOrdered: {
          type: Sequelize.DATE,
          allowNull: true
        },        
        customer_id: { type: Sequelize.INTEGER, allowNull: true },
        lead_project_id: { type: Sequelize.INTEGER, allowNull: true },
        ship_to: { type: Sequelize.STRING(255), allowNull: true },
        material_total: { type: Sequelize.STRING(255), allowNull: true },
        additional_total: { type: Sequelize.STRING(255), allowNull: true },
        total: { type: Sequelize.STRING(255), allowNull: true },
        order_gross: { type: Sequelize.STRING(255), allowNull: true },
        discount_amount: { type: Sequelize.STRING(255), allowNull: true },
        total_misc: { type: Sequelize.STRING(255), allowNull: true },
        taxable: { type: Sequelize.STRING(255), allowNull: true },
        tax_amount: { type: Sequelize.STRING(255), allowNull: true },
        freight: { type: Sequelize.STRING(255), allowNull: true },
        orderGp: { type: Sequelize.STRING(255), allowNull: true },
        customer_details: { type: Sequelize.STRING(255), allowNull: true },
        notes: { type: Sequelize.TEXT, allowNull: true },
        status: { type: Sequelize.STRING(255), allowNull: true },
        wanted: { type: Sequelize.STRING(255), allowNull: true },
        customer_po: { type: Sequelize.STRING(255), allowNull: true },
        sales_order_type: { type: Sequelize.STRING(200), allowNull: true },
        contract: { type: Sequelize.INTEGER, allowNull: true },
        ship_order_type: { type: Sequelize.STRING(200), allowNull: true },
        deleted_at: { type: Sequelize.DATE, allowNull: true },
        
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
  
    return SaleMaterialQuotes;
  };
  