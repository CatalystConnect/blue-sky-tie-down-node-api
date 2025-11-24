'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      "budget_categories",
      [
        {
          name: "SILL PLATE",
          status: "active",
          ordering: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "TIE DOWN",
          status: "active",
          ordering: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "SW MISC",
          status: "active",
          ordering: 3,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "UP LIFT",
          status: "active",
          ordering: 4,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "ROOF",
          status: "active",
          ordering: 5,
          created_at: new Date(),
          updated_at: new Date(),
        },
         {
          name: "CORIDOR",
          status: "active",
          ordering: 6,
          created_at: new Date(),
          updated_at: new Date(),
        },
         {
          name: "DECK",
          status: "active",
          ordering: 7,
          created_at: new Date(),
          updated_at: new Date(),
        },
         {
          name: "STAIR WELLS",
          status: "active",
          ordering: 8,
          created_at: new Date(),
          updated_at: new Date(),
        },
         {
          name: "BEAM",
          status: "active",
          ordering: 9,
          created_at: new Date(),
          updated_at: new Date(),
        },
         {
          name: "POSTS",
          status: "active",
          ordering: 10,
          created_at: new Date(),
          updated_at: new Date(),
        },
         {
          name: "RTU",
          status: "active",
          ordering: 11,
          created_at: new Date(),
          updated_at: new Date(),
        },
         {
          name: "MISC",
          status: "active",
          ordering: 12,
          created_at: new Date(),
          updated_at: new Date(),
        },
         {
          name: "CMU",
          status: "active",
          ordering: 13,
          created_at: new Date(),
          updated_at: new Date(),
        },
         {
          name: "STL",
          status: "active",
          ordering: 14,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("budget_categories", null, {});
  }
};
