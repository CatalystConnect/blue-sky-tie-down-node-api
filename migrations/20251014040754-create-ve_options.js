"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ve_options", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      budget_books_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      subject: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      amount: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      optionDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      groups: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable("ve_options");
  },
};
