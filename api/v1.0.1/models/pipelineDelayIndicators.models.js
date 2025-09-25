module.exports = (sequelize, Sequelize) => {
  const pipelineDelayIndicators = sequelize.define(
    "pipeline_delay_indicators",
    {
         id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      pipelineId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      delayDays: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      color: {
        type: Sequelize.STRING(11),
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
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ')
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

  return pipelineDelayIndicators;
};
