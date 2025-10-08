"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("budget_books", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: { type: Sequelize.INTEGER, allowNull: true },
      site_plan_id: { type: Sequelize.INTEGER, allowNull: true },
      engineer_id: { type: Sequelize.INTEGER, allowNull: true },
      customer_id: { type: Sequelize.INTEGER, allowNull: true },
      contact_id: { type: Sequelize.STRING, allowNull: true },
      lead_id: { type: Sequelize.INTEGER, allowNull: true },
      project_id: { type: Sequelize.INTEGER, allowNull: true },
      tax_id: { type: Sequelize.INTEGER, allowNull: true },

      // Basic project details
      name: { type: Sequelize.STRING, allowNull: true },
      address: { type: Sequelize.STRING, allowNull: true },
      city: { type: Sequelize.STRING, allowNull: true },
      state: { type: Sequelize.STRING, allowNull: true },
      zip: { type: Sequelize.STRING, allowNull: true },
      job_no: { type: Sequelize.STRING, allowNull: true },
      quote_date: { type: Sequelize.DATEONLY, allowNull: true },
      plan_date: { type: Sequelize.DATEONLY, allowNull: true },

      // Status & notes
      units: { type: Sequelize.STRING, allowNull: true },
      plan_status: { type: Sequelize.STRING, allowNull: true },
      plan_info: { type: Sequelize.STRING, allowNull: true },
      plan_note: { type: Sequelize.TEXT, allowNull: true },
      terms: { type: Sequelize.TEXT, allowNull: true },
      limit_notes: { type: Sequelize.TEXT, allowNull: true },

      // Pricing / Budget flags
      is_pricing: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      is_budget_only: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },

      // Margins & taxes
      tax: { type: Sequelize.STRING, allowNull: true },
      up_margin: { type: Sequelize.STRING, allowNull: true },
      sp_margin: { type: Sequelize.STRING, allowNull: true },
      mc_margin: { type: Sequelize.STRING, allowNull: true },
      sw_margin: { type: Sequelize.STRING, allowNull: true },
      commission: { type: Sequelize.STRING, allowNull: true },
      commission_rate: { type: Sequelize.STRING, allowNull: true },

      // Calculations
      total_adders: { type: Sequelize.STRING, allowNull: true },
      total_calculate: { type: Sequelize.STRING, allowNull: true },
      per_sqft: { type: Sequelize.STRING, allowNull: true },
      bldg_count: { type: Sequelize.STRING, allowNull: true },
      bldg_gsqft: { type: Sequelize.STRING, allowNull: true },
      bldg_sqft: { type: Sequelize.STRING, allowNull: true },
      bldg_cost: { type: Sequelize.STRING, allowNull: true },
      bldg_price: { type: Sequelize.STRING, allowNull: true },
      price: { type: Sequelize.STRING, allowNull: true },
      total: { type: Sequelize.STRING, allowNull: true },
      total_price_sqft: { type: Sequelize.STRING, allowNull: true },

      // Design / Engineering / Budget / Shipping
      design: { type: Sequelize.STRING, allowNull: true },
      design_total: { type: Sequelize.STRING, allowNull: true },
      design_hr: { type: Sequelize.STRING, allowNull: true },
      design_hrs: { type: Sequelize.STRING, allowNull: true },

      engineering: { type: Sequelize.STRING, allowNull: true },
      engineering_total: { type: Sequelize.STRING, allowNull: true },
      engineering_seal: { type: Sequelize.STRING, allowNull: true },
      engineering_seals: { type: Sequelize.STRING, allowNull: true },

      budget: { type: Sequelize.STRING, allowNull: true },
      budget_total: { type: Sequelize.STRING, allowNull: true },
      budget_hr: { type: Sequelize.STRING, allowNull: true },
      budget_hrs: { type: Sequelize.STRING, allowNull: true },

      shipping: { type: Sequelize.STRING, allowNull: true },
      shipping_total: { type: Sequelize.STRING, allowNull: true },
      shipping_ship: { type: Sequelize.STRING, allowNull: true },
      shipping_shipment: { type: Sequelize.STRING, allowNull: true },

      // Miscellaneous
      sw_tiedown: { type: Sequelize.STRING, allowNull: true },
      up_lift: { type: Sequelize.STRING, allowNull: true },
      misc: { type: Sequelize.STRING, allowNull: true },
      anchorage: { type: Sequelize.STRING, allowNull: true },

      // Project limits
      shipment_limit: { type: Sequelize.STRING, allowNull: true },
      fill_in_limit: { type: Sequelize.STRING, allowNull: true },
      seal_limit: { type: Sequelize.STRING, allowNull: true },

      // Optional Scopes & Pricing
      inc_exc_scope: { type: Sequelize.INTEGER, allowNull: true },
      des_eng: { type: Sequelize.STRING, allowNull: true },
      price_des_eng: { type: Sequelize.STRING, allowNull: true },
      projectType: { type: Sequelize.STRING, allowNull: true },
      taxRate: { type: Sequelize.STRING, allowNull: true },
      contact_email: { type: Sequelize.STRING, allowNull: true },

      // Timestamps
      created_at: { type: Sequelize.DATE, allowNull: true },
      updated_at: { type: Sequelize.DATE, allowNull: true },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });
  },
  

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("budget_books");
  },
};
