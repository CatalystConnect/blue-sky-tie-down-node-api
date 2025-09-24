module.exports = (sequelize, Sequelize) => {
  const TermsCodes = sequelize.define(
    "terms_codes", // table name
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      code: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      days_due: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      due_type: {
        type: Sequelize.ENUM("invoice_date", "eom", "delivery_date"),
        allowNull: false,
      },
      term_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      discount_days: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      discount_percent: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      is_cod: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      is_prepay: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
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
      paranoid: true, // enable soft deletes
      deletedAt: "deleted_at",
    }
  );

  return TermsCodes;
};
