module.exports = (sequelize, Sequelize) => {
  const sitePlanItems = sequelize.define(
    "site_plan_items",
    {
     id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      site_plan_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      sitePlan_name2: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      site_qty: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      sov_qa: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      sov_qr: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,       
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
  return sitePlanItems;
};
