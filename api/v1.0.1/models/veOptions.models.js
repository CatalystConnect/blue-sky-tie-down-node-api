module.exports = (sequelize, Sequelize) => {
  const veOptions = sequelize.define(
    "ve_options",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
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
      optionDate: {
        type: DataTypes.DATE,
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
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      deleted_at: {
        type: DataTypes.DATE,
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
  return veOptions;
};
