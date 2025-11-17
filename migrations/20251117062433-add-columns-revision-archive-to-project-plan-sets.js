'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn("project_plan_sets", "revisionRequired", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn("project_plan_sets", "archiveData", {
      type: Sequelize.TEXT("long"),
      allowNull: true,
      defaultValue: "",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("project_plan_sets", "revisionRequired");
    await queryInterface.removeColumn("project_plan_sets", "archiveData");
  }
};
