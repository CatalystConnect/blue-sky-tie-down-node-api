module.exports = (sequelize, Sequelize) => {
  const budgetHistory = sequelize.define(
    "budget_book_documents",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      budget_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      changed_by: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      revision_status: {
        type: Sequelize.ENUM('1', '0'),
        allowNull: false,
        defaultValue: '0'
      },
      log: {
        type: Sequelize.TEXT('long'),
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

  return budgetHistory;
};
