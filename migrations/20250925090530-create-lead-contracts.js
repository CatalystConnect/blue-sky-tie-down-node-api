'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('lead_contracts', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      lead_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      budget_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      scope_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      site_plan_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      bldg_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      bldg_types: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      total: {
        type: Sequelize.DECIMAL(10,4),
        allowNull: true
      },
      contract_status: {
        type: Sequelize.ENUM('accept', 'reject'),
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
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('lead_contracts');
  }
};
