'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('vendors', 'city', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn('vendors', 'state', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('vendors', 'city');
    await queryInterface.removeColumn('vendors', 'state');
  }
};
