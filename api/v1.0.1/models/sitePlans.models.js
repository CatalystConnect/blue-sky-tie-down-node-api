module.exports = (sequelize, Sequelize) => {
  const sitePlans = sequelize.define(
    "site_plans",
    {
     id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      site_index: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      bldg_id: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      site_plan_name: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      sov_sp: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      sov_td: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      sov_up: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      sov_mc: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      sov_total: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      order_no: {
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
      }
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
  return sitePlans;
};
