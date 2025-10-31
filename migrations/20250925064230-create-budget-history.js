'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('budget_history', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      budget_book_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      changed_by: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      revision_status: {
        type: Sequelize.ENUM('1', '0'),
        allowNull: false,
        defaultValue: '0'
      },
      log: {
        type: Sequelize.TEXT('long'),
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
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('budget_history');
  }
};
