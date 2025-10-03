module.exports = (sequelize, Sequelize) => {
  const leads = sequelize.define(
    "leads",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
      rode_assignee_id: {
        type: Sequelize.INTEGER,
      },
      hardware_assignee_id: {
        type: Sequelize.INTEGER,
      },
      pipeline_type: {
        type: Sequelize.INTEGER,
      },
      pipeline_status: {
        type: Sequelize.INTEGER,
      },
      nextStepDate: {
        type: Sequelize.STRING(255),
      },
      isDelayed: {
        type: Sequelize.STRING(255),
      },
      lead_pipeline_status: {
        type: Sequelize.STRING(255),
      },
      lead_status_id: {
        type: Sequelize.INTEGER,
      },
      lead_type_id: {
        type: Sequelize.INTEGER,
      },
      quote_status_id: {
        type: Sequelize.INTEGER,
      },
      date_record: {
        type: Sequelize.DATE,
      },
      due_date: {
        type: Sequelize.DATE,
      },
      est_comp: {
        type: Sequelize.STRING(255),
      },
      assigned_date: {
        type: Sequelize.DATE,
      },
      completed_date: {
        type: Sequelize.DATE,
      },
      quote_date: {
        type: Sequelize.DATE,
      },
      quote: {
        type: Sequelize.STRING(255),
      },
      is_rode: {
        type: Sequelize.STRING(255),
      },
      is_hardware: {
        type: Sequelize.STRING(255),
      },
      reviewer: {
        type: Sequelize.STRING(255),
      },
      project_name: {
        type: Sequelize.STRING(255),
      },
      notes: {
        type: Sequelize.TEXT,
      },
      engineer_id: {
        type: Sequelize.INTEGER,
      },
      contact_id: {
        type: Sequelize.INTEGER,
      },
      company_id: {
        type: Sequelize.INTEGER,
      },
      project_id: {
        type: Sequelize.INTEGER,
      },
      sale_person_id: {
        type: Sequelize.INTEGER,
      },
      amount: {
        type: Sequelize.STRING(255),
      },
      dcs: {
        type: Sequelize.STRING(255),
      },
      priority: {
        type: Sequelize.STRING(255),
      },
      next_action: {
        type: Sequelize.STRING(255),
      },
      assigned_user: {
        type: Sequelize.INTEGER,
      },
      secretId: {
        type: Sequelize.CHAR(100),
      },
      secondary_contact: {
        type: Sequelize.STRING(255),
      },
      isHot: {
        type: Sequelize.STRING(50),
      },
      leadTeamId: {
        type: Sequelize.INTEGER,
      },
      defaultAssignTeam: {
        type: Sequelize.INTEGER,
      },
      leadNotesField: {
        type: Sequelize.TEXT,
      },
      requestedScope: {
        type: Sequelize.TEXT,
      },
      isTicket: {
        type: Sequelize.STRING(255),
      },
      created_at: {
        type: Sequelize.DATE,
      },
      updated_at: {
        type: Sequelize.DATE,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
      isDefaultLead: {
        type: Sequelize.STRING(255),
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
  return leads;
};
