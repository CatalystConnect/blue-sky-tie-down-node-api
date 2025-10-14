module.exports = (sequelize, Sequelize) => {
  const projectScopeSegments = sequelize.define(
    "budget_books_scope_segments",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      site_plan_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      budget_books_scope_group_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      scope_sagment_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      scopeId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      budget_Cat_Id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      budgetIndex: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      site_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      is_include: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      client_notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      acc: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      internal_notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      price_sqft: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      additionals: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      price_w_additional: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      cost: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      costSqft: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      conditions: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      total: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      optionPercentage: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
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

  return projectScopeSegments;
};
