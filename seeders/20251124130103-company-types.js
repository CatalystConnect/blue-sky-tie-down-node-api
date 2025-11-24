'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "company_types",
      [
        {
          id: 1,
          name: "Engineer",
          background_color: null,
          sort_order: 1,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
        {
          id: 2,
          name: "General Contractor",
          background_color: null,
          sort_order: 2,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
        {
          id: 3,
          name: "Developer",
          background_color: null,
          sort_order: 3,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
        {
          id: 4,
          name: "Architect",
          background_color: null,
          sort_order: 4,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
        {
          id: 5,
          name: "Customer",
          background_color: null,
          sort_order: 5,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("company_types", null, {});
  }
};
