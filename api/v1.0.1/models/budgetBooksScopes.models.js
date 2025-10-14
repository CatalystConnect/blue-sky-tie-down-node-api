module.exports = (sequelize, Sequelize) => {
  const projectScopes = sequelize.define(
    "budget_books_scopes",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        autoIncrement: true,
        primaryKey: true,
      },
      budget_books_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      scope_id: {
        type: Sequelize.INTEGER,
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
      short_title: {
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

  return projectScopes;
};
