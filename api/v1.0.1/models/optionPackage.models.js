module.exports = (sequelize, Sequelize) => {
  const OptionPackage = sequelize.define(
    "option_packages",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      budget_books_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      subject: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      amount: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      groups: {
        type: DataTypes.TEXT("long"),
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  return OptionPackage;
};
