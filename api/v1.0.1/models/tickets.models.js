module.exports = (sequelize, Sequelize) => {
  const Tickets = sequelize.define(
    "tickets",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      lead_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      ticket_template_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      parentTicketId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      requiredToMoveStatus: {
        type: Sequelize.STRING(255),
        allowNull: true,
       
      },
      ticket_status: {
        type: Sequelize.STRING,
        allowNull: true,
       
      },
      ticketGroupId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      ticketSubjectId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      projectId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      taskUrgencyId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      companyId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      checklist: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      file: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      fileURL: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      pipelineId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      pipelineStatusId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      leadTags: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      additional_info_on_status_change: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      isPin: {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: "false",
      },
    },
    {
      tableName: "tickets", 
      freezeTableName: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true,
      deletedAt: "deleted_at",
    }
  );

  return Tickets;
};
