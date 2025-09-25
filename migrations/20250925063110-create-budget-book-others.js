'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('budget_book_others', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      budget_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      site_id: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      site_plan_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      scopeId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      otherReapterId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      budget_cat_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      is_include: {
        type: Sequelize.STRING(125),
        allowNull: true
      },
      options: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      price_sqft: {
        type: Sequelize.DECIMAL(10,4),
        allowNull: true,
        defaultValue: 0.0000
      },
      additionals: {
        type: Sequelize.DECIMAL(10,4),
        allowNull: true,
        defaultValue: 0.0000
      },
      cost: {
        type: Sequelize.DECIMAL(10,4),
        allowNull: true,
        defaultValue: 0.0000
      },
      total: {
        type: Sequelize.DECIMAL(20,4),
        allowNull: true,
        defaultValue: 0.0000
      },
      price_w_additional: {
        type: Sequelize.DECIMAL(10,4),
        allowNull: true,
        defaultValue: 0.0000
      },
      costSqft: {
        type: Sequelize.DECIMAL(10,4),
        allowNull: true,
        defaultValue: 0.0000
      },
      optionPercentage: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
      });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('budget_book_others');
  }
};
