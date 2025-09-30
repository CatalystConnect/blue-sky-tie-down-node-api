module.exports = (sequelize, Sequelize) => {
  const budgetCategory = sequelize.define(
    "budget_categories", // table name
    {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        status: {
            type: Sequelize.ENUM('active', 'inactive'),
            allowNull: false,
            defaultValue: 'active'
        },
        ordering: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        deleted_at: {
            type: Sequelize.DATE,
            allowNull: true
        }
    },
    {
      timestamps: true,
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true, // enable soft deletes
      deletedAt: "deleted_at",
    }
  );

  return budgetCategory;
};
