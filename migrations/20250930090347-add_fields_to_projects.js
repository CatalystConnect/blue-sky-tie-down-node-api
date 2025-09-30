'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('projects', 'projectTags', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('projects', 'projectFiles', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('projects', 'architecture', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('projects', 'takeoffactualtime', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('projects', 'dueDate', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('projects', 'projectAttachmentUrls', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('projects', 'attachmentsLink', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('projects', 'projectRifFields', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('projects', 'projectTags');
    await queryInterface.removeColumn('projects', 'projectFiles');
    await queryInterface.removeColumn('projects', 'architecture');
    await queryInterface.removeColumn('projects', 'takeoffactualtime');
    await queryInterface.removeColumn('projects', 'dueDate');
    await queryInterface.removeColumn('projects', 'projectAttachmentUrls');
    await queryInterface.removeColumn('projects', 'attachmentsLink');
    await queryInterface.removeColumn('projects', 'projectRifFields');
  }
};
