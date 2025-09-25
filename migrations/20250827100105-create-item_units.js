"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("item_units", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      um: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      qty: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      per: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      upc: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      height: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      weight: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      length: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      width: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      unit_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      per_unit_id: {
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
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("item_units");
  },
};
