"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("leads", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      rode_assignee_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      hardware_assignee_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      pipeline_type: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      pipeline_status: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      nextStepDate: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      isDelayed: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      lead_pipeline_status: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      lead_status_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      lead_type_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      quote_status_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      date_record: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      due_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      est_comp: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      assigned_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      completed_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      quote_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      quote: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      is_rode: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      is_hardware: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      reviewer: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      project_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      engineer_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      contact_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      company_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      sale_person_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      amount: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      dcs: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      priority: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      next_action: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      assigned_user: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      secretId: {
        type: Sequelize.CHAR(100),
        allowNull: true,
      },
      secondary_contact: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      isHot: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      leadTeamId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      defaultAssignTeam: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      isTicket: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("leads");
  },
};
