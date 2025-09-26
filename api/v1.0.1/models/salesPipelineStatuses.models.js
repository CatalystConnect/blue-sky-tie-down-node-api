module.exports = (sequelize, Sequelize) => {
  const salesPipelinesStatuses = sequelize.define(
    "sales_pipeline_statuses",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      sales_pipeline_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      expectedDays: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: 'expectedDays',
      },
      statusColor: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: 'statusColor',
      },
      percentage: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      ordering: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      is_default: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      hide_status: {
        type: Sequelize.STRING(100),
        allowNull: true,
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

  return salesPipelinesStatuses;
};
