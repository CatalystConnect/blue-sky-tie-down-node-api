'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('material_quote_additionals', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      material_quote_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      item: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      qty: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      cost: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      margin: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      commission: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      price: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      total: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('material_quote_additionals');
  }
};
