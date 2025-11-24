'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.sequelize.query(`
      ALTER TABLE contacts 
      ALTER COLUMN state TYPE INTEGER 
      USING NULLIF(state, '')::integer;
    `);
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.sequelize.query(`
      ALTER TABLE contacts 
      ALTER COLUMN state TYPE VARCHAR(255);
    `);
  }
};
