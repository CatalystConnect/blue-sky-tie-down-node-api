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
        type: Sequelize.DATE,
        allowNull: true
      },
      plan_link: {
        type: Sequelize.STRING,
        allowNull: true
      },
      planFiles: {
        type: Sequelize.STRING,  
        allowNull: true
      },
      plan_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      rev_status: {
        type: Sequelize.STRING,
        allowNull: true
      },
      plan_reviewed_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      plan_reviewed_by: {
        type: Sequelize.INTEGER, 
        allowNull: true
      },
      data_collocated_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      plan_revision_notes: {
        type: Sequelize.TEXT,
        allowNull: true
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
