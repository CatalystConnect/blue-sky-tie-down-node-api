'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'otp', {
      type: Sequelize.STRING(10),
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'otp_expiry', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'otp');
    await queryInterface.removeColumn('users', 'otp_expiry');
  }
};
