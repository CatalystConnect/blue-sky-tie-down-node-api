'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('po_lines', 'item', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
   await queryInterface.changeColumn('po_lines', 'item', {
      type: Sequelize.STRING,
      allowNull: true, 
    });
  }
};
