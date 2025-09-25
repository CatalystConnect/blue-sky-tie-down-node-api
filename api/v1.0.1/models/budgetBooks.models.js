module.exports = (sequelize, Sequelize) => {
  const BudgetBooks = sequelize.define(
    "budget_books",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      address: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      city: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      state: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      zip: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      project_status: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      engineer: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      customer: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      architect: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      gross_sqft: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      project_tags: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      project_file: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      project_manager: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      alternate_project_name: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      project_value: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      estimated_value: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      units: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      projectType: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      projectAttachmentUrls: {
        type: Sequelize.TEXT,
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

  return BudgetBooks;
};
