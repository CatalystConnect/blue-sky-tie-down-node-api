'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('project_costs', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      lead_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      sp: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      td: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      swm: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      up: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      rf: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      co: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      dk: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      st: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      dm: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      po: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      cmu: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      stl: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      mc: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      rtu: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      type: {
        type: Sequelize.STRING(255),
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('project_costs');
  }
};
