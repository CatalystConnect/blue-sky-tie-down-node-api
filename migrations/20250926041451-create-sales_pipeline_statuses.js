"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("sales_pipeline_statuses", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      sales_pipeline_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      expectedDays: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      statusColor: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      percentage: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      ordering: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      is_default: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      hide_status: {
        type: Sequelize.STRING(100),
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
    await queryInterface.dropTable("sales_pipeline_statuses");
  },
};
