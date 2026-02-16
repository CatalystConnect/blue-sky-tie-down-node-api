'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('vendor_item', 'item_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('vendor_item', 'item_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  }
};
