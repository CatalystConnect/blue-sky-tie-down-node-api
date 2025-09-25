'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('model_has_permissions', {
      permission_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      model_type: {
        type: Sequelize.STRING(255),
        allowNull: false,
        primaryKey: true,
      },
      model_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
    });
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('model_has_permissions');
  }
};
