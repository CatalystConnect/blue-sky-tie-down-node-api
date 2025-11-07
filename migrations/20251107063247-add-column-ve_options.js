"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("ve_options", "scope_sagment_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn("ve_options", "site_id", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("ve_options", "budget_Cat_Id", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("ve_options", "scope_sagment_id");
    await queryInterface.removeColumn("ve_options", "site_id");
    await queryInterface.removeColumn("ve_options", "budget_Cat_Id");
  },
};
