'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('scope_categories', 'order_index', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      after: 'title' 
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('scope_categories', 'order_index');
  }
};
