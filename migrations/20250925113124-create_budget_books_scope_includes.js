'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('budget_books_scope_includes', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      budget_books_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      budget_category_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: '1'
      },
      is_include: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1
      },
      is_exclude: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1
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
   await queryInterface.dropTable('budget_books_scope_includes');
  }
};
