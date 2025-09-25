module.exports = (sequelize, Sequelize) => {
  const failedJobs = sequelize.define(
    "failed_jobs",
    {
       id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      uuid: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      connection: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      queue: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      payload: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      exception: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      failed_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
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

  return failedJobs;
};
