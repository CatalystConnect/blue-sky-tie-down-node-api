'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("vendor_item", {
       id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      vendor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      vendor_part_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      vendor_description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
       default_unit_cost: {
        type: Sequelize.DECIMAL(19, 4),
        allowNull: true,
      },
       currency_code: {
        type: Sequelize.STRING(3),
        allowNull: true,
      },
     
      purchase_uom: {
        type: Sequelize.STRING,
        allowNull: true,
      },
     
    
      future_effective_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },

    
       min_order_qty: {
        type: Sequelize.DECIMAL(18, 6),
        allowNull: true,
      },

      order_multiple_qty: {
        type: Sequelize.DECIMAL(18, 6),
        allowNull: true,
      },

      lead_time_days: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      standard_lead_time_days: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },


      is_preferred_vendor: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      ranking: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

    
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        
      },

   
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable("vendor_item");
  }
};
