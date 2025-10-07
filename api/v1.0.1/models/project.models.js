module.exports = (sequelize, Sequelize) => {
  const project = sequelize.define(
    "projects",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      state: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      zip: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      project_status: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      engineer_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      customer: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      gross_sqft: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      project_tags: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      project_file: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      project_manager: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      alternate_project_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      project_value: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      estimated_value: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      units: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      projectType: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      is_pricing: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      is_budget_only: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      plan_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      project_phase: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      date_received: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      rev_status: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      plan_reviewed_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
        plan_reviewed_by: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
       assign_team: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      plan_revision_notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      data_collocated_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      bldgs: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      units_count: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      wind_zone: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
       takeoff_status: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      seismic_zone: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      developer_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      general_contractor_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      assign_to_budget: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      take_off_team_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      take_off_type: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      take_off_scope: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      assign_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      plan_link: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      submissionType: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      planFiles: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      projectTags: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      projectFiles: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      architecture: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      takeoffactualtime: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      dueDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      projectAttachmentUrls: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      attachmentsLink: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      projectRifFields: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      bldg_gsqft: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      takeofCompleteDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      connectplan: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      takeOfEstimateTime: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      surveyorNotes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      completedFiles: {
        type: Sequelize.TEXT,
        allowNull: true,
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

  return project;
};
