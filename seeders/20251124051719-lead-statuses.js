'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      "lead_statuses",
      [
        {
          user_id: 1,
          title: "New",
          color: "#3498db",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 1,
          title: "Hold",
          color: "#f1c40f",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 1,
          title: "Connected",
          color: "#27ae60",
          created_at: new Date(),
          updated_at: new Date(),
        },
        
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete("lead_statuses", null, {});
  }
};
