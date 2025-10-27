module.exports = (sequelize, Sequelize) => {
  const budgetBooksSites = sequelize.define(
    "budget_books_sites",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      budget_books_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      bid: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      qty: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      gs_qft: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      ts_qft: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      cs_qft: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      ps_qft: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      cost: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      c_total: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      c_sw: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      c_up: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      c_sp: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      c_mc: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      pb_sw: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      pb_up: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      pb_sp: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      pb_mc: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      pb_tot: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      p_tot: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      p_sw: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      p_up: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      p_sp: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      p_mc: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      site_Id: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      project_bldg: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      project_bldg_type: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      site_design: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      site_design_sw: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      site_design_up: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      site_engineering: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      site_engineering_sw: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      site_engineering_up: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      site_budget: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      site_budget_sp: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      site_budget_sw: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      site_budget_up: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      site_budget_mc: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      site_shipping: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      site_shipping_sp: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      site_shipping_sw: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      site_shipping_up: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      site_shipping_mc: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      site_design_type: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      site_engineering_type: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      site_budget_type: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      site_shipping_type: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true,
      deletedAt: "deleted_at",
    }
  );

  return budgetBooksSites;
};
