module.exports = (sequelize, Sequelize) => {
  const salesPipelineDelayIndicators = sequelize.define(
    "sales_pipeline_delay_indicators",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      sales_pipeline_id: {
        type: Sequelize.INTEGER,
      },
      delayDays: {
        type: Sequelize.INTEGER,
        field: 'delayDays',
      },
      color: {
        type: Sequelize.STRING(100),
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

  return salesPipelineDelayIndicators;
};
