'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('project_rfis', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      budget_book_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      rfi_number: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      rfi_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      submitted_by: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      plan_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      subject: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      attachmentsLink: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      document_history: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      impacts: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('SUBMITTED', 'CLOSED'),
        allowNull: true,
        defaultValue: 'SUBMITTED'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },

  async down(queryInterface, Sequelize) {
   await queryInterface.dropTable('project_rfis');
  }
};
