module.exports = (sequelize, Sequelize) => {
  const projectPlanSets = sequelize.define(
    "project_plan_sets",
    {
       id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      submissionType: {
        type: Sequelize.STRING,
        allowNull: true
      },
      date_received: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      plan_link: {
        type: Sequelize.STRING,
        allowNull: true
      },
      planFiles: {
        type: Sequelize.TEXT,  
        allowNull: true
      },
      plan_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      rev_status: {
        type: Sequelize.STRING,
        allowNull: true
      },
      planType: {
        type: Sequelize.STRING,
        allowNull: true
      },
      plan_reviewed_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      plan_reviewed_by: {
        type: Sequelize.INTEGER, 
        allowNull: true
      },
      data_collocated_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      plan_revision_notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
       revisionRequired: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
       archiveData: {
        type: Sequelize.TEXT("long"),
        allowNull: true
      },
      workflow_status: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
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
      deletedAt: "deleted_at",
      paranoid: true,
      
    }
  );

  return projectPlanSets;
};
