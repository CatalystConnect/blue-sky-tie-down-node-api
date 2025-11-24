'use strict';
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("password", 10);

    return queryInterface.bulkInsert(
      "users",
      [
        {
          userType: "internal",
          role: 1,
          name: "taylor paul",
          first_name: "taylor",
          last_name: "paul",
          username: "admin",
          email: "admin@gmail.com",
          email_verified_at: new Date(),
          password: hashedPassword,
          chk_password: "password",
          phone: null,
          address: null,
          status: "active",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
   return queryInterface.bulkDelete("users", null, {});
  }
};
