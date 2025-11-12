module.exports = (sequelize, Sequelize) => {
  const leadScopeMappings = sequelize.define(
    "lead_scope_mappings",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      lead_id: {
        type: Sequelize.INTEGER,
      },
      lead_scope_id: {
        type: Sequelize.STRING,
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
  return leadScopeMappings;
};
