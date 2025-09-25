'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pipeline_activities', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      assigned_user_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      lead_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      pipeline_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      to_status: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      from_status: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      notes: {
        type: Sequelize.STRING(255),
        allowNull: false
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
    await queryInterface.dropTable('pipeline_activities');
  }
};
