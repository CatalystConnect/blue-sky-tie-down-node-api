'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('terms_codes', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      days_due: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      due_type: {
        type: Sequelize.ENUM('invoice_date', 'eom', 'delivery_date'),
        allowNull: true,
      },
      term_type: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      discount_days: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      discount_percent: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      is_cod: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      is_prepay: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      active: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('terms_codes');
  }
};
