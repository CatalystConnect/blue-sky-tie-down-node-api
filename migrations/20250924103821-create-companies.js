"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("companies", {
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
      company_type: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      state: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      zip: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      company_notes: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      company_lead_score: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      tax: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("companies");
  },
};
