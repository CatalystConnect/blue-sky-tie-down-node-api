'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("vendor_address", {
       id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      vendor_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      address_type: {
        type: Sequelize.ENUM("MAIN", "REMIT_TO", "SHIP_FROM", "RETURNS"),
        allowNull: false,
      },

      is_default: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      street_1: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      street_2: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      state: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      postal_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      country_code: {
        type: Sequelize.STRING(2),
        allowNull: false,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.dropTable("vendor_address");
  }
};
