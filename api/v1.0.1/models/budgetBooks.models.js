module.exports = (sequelize, Sequelize) => {
  const BudgetBooks = sequelize.define(
    "budget_books",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      // ---------- Basic Info ----------
      user_id: Sequelize.INTEGER,
      engineer_id: Sequelize.INTEGER,
      name: Sequelize.STRING,
      address: Sequelize.STRING,
      quote_date: Sequelize.DATEONLY,
      job_no: Sequelize.STRING,

      // ---------- Flags ----------
      is_pricing: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_budget_only: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      // ---------- Margins ----------
      up_margin: Sequelize.STRING,
      sp_margin: Sequelize.STRING,
      mc_margin: Sequelize.STRING,
      sw_margin: Sequelize.STRING,

      // ---------- Plan Info ----------
      plan_date: Sequelize.STRING,
      plan_status: Sequelize.STRING,
      plan_info: Sequelize.STRING,
      plan_note: Sequelize.TEXT,

      // ---------- General Info ----------
      zip: Sequelize.STRING,
      state: Sequelize.STRING,
      city: Sequelize.STRING,
      projectType: Sequelize.STRING,

      // ---------- Design & Engineering ----------
      design: Sequelize.STRING,
      design_total: Sequelize.STRING,
      design_hr: Sequelize.STRING,
      design_hrs: Sequelize.STRING,
      engineering: Sequelize.STRING,
      engineering_total: Sequelize.STRING,
      engineering_seal: Sequelize.STRING,
      engineering_seals: Sequelize.STRING,

      // ---------- Budget & Shipping ----------
      budget: Sequelize.STRING,
      budget_total: Sequelize.STRING,
      budget_hr: Sequelize.STRING,
      budget_hrs: Sequelize.STRING,
      shipping: Sequelize.STRING,
      shipping_total: Sequelize.STRING,
      shipping_ship: Sequelize.STRING,
      shipping_shipment: Sequelize.STRING,

      // ---------- Building Info ----------
      per_sqft: Sequelize.STRING,
      bldg_count: Sequelize.STRING,
      bldg_gsqft: Sequelize.STRING,
      bldg_sqft: Sequelize.STRING,
      bldg_cost: Sequelize.STRING,
      bldg_price: Sequelize.STRING,
      price: Sequelize.STRING,

      // ---------- Misc Totals ----------
      sw_tiedown: Sequelize.STRING,
      up_lift: Sequelize.STRING,
      misc: Sequelize.STRING,
      anchorage: Sequelize.STRING,
      total: Sequelize.STRING,

      // ---------- Tax & Commission ----------
      tax: Sequelize.STRING,
      commission: Sequelize.STRING,
      commission_rate: Sequelize.STRING,
      contact_email: Sequelize.STRING,


      // ---------- Contacts ----------
      customer_id: Sequelize.INTEGER,
      contact_id: Sequelize.STRING,
      taxRate: Sequelize.STRING,

      // ---------- Limits ----------
      fill_in_limit: Sequelize.STRING,
      shipment_limit: Sequelize.STRING,
      seal_limit: Sequelize.STRING,
      limit_notes: Sequelize.TEXT,

      // ---------- Relations ----------
      project_id: Sequelize.INTEGER,
      lead_id: Sequelize.INTEGER,

      // ---------- Extra ----------
      terms: Sequelize.TEXT,
    },
    {
      timestamps: true,
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      paranoid: true,
    }
  );

  return BudgetBooks;
};
