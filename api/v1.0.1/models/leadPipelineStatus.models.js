module.exports = (sequelize, Sequelize) => {
  const leadPipelineStatus = sequelize.define(
    "lead_pipeline_status",
    {
       id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      lead_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      pipeline_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      status_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      due_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      reason: {
        type: Sequelize.STRING(255),
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

  return leadPipelineStatus;
};
