'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('items', {
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
      sku: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      image: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      short_description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      website_id: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      freeform: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      meta: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      title_tag: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      meta_description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      brand_id: {
        type: Sequelize.INTEGER,
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
     await queryInterface.dropTable('items');     
    
  }
};
