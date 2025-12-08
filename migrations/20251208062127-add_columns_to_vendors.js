'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

     await queryInterface.addColumn("vendors", "vendor_code", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });

     await queryInterface.addColumn("vendors", "dba_name", {
      type: Sequelize.STRING,
      allowNull: true,
    });


    await queryInterface.addColumn("vendors", "tax_id", {
      type: Sequelize.STRING,
      allowNull: true,
    });

     await queryInterface.addColumn("vendors", "is_1099_eligible", {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    })

     await queryInterface.addColumn("vendors", "payment_terms_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

     await queryInterface.addColumn("vendors", "incoterm_code", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("vendors", "freight_terms", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("vendors", "default_shipping_method_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });


    await queryInterface.addColumn("vendors", "status", {
      type: Sequelize.ENUM("ACTIVE", "HOLD", "INACTIVE"),
      allowNull: true,
      defaultValue: "ACTIVE",
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("vendors", "vendor_code");
    await queryInterface.removeColumn("vendors", "dba_name");
    await queryInterface.removeColumn("vendors", "tax_id");
    await queryInterface.removeColumn("vendors", "is_1099_eligible");
    await queryInterface.removeColumn("vendors", "payment_terms_id");
    await queryInterface.removeColumn("vendors", "incoterm_code");
    await queryInterface.removeColumn("vendors", "freight_terms");
    await queryInterface.removeColumn("vendors", "default_shipping_method_id");
    await queryInterface.removeColumn("vendors", "status");
  }
};
