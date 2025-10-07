module.exports = (sequelize, Sequelize) => {
  const budgetBooksDrawings = sequelize.define(
    "budget_books_drawings",
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
      submittal_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: false
      },
      is_include: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: false
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

  return budgetBooksDrawings;
};
