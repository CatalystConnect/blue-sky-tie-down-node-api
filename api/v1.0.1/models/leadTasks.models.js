module.exports = (sequelize, Sequelize) => {
  const leadTasks = sequelize.define(
    "lead_tasks",
    {
       id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      lead_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      task_status_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      subject: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      priority: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      file: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      file_name: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      due_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      task_group_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      task_subject_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      task_urgency_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      company_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      checklist: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true
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

  return leadTasks;
};
