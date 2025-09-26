module.exports = (sequelize, Sequelize) => {
  const salesPipelines = sequelize.define(
    "sales_pipelines",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255),
      },
      sales_pipeline_group_id: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.STRING(255),
      },
      ordering: {
        type: Sequelize.INTEGER,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return salesPipelines;
};
