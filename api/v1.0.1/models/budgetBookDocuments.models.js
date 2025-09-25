module.exports = (sequelize, Sequelize) => {
  const BudgetBookDocuments = sequelize.define(
    "budget_book_documents",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      budget_book_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      file_name: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      file_path: {
        type: Sequelize.TEXT('long'),
        allowNull: true
      },
      type: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT('long'),
        allowNull: true
      },
      is_display: {
        type: Sequelize.INTEGER,
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

  return BudgetBookDocuments;
};
