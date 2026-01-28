'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('vendor_item', 'buyer', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('vendor_item', 'buyer_type', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('vendor_item', 'seasonal_adj', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    });
    await queryInterface.addColumn('vendor_item', 'last_warning_date', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('vendor_item', 'calendar_year_hits', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    });
    await queryInterface.addColumn('vendor_item', 'last_12_month_hits', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    });
    await queryInterface.addColumn('vendor_item', 'average_lead_time', {
      type: Sequelize.INTEGER,
      allowNull: true,

    });
    await queryInterface.addColumn('vendor_item', 'cost_per', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    });
    await queryInterface.addColumn('vendor_item', 'cost_uom', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('vendor_item', 'fut_std', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    });
    await queryInterface.addColumn('vendor_item', 'fut_effective', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('vendor_item', 'average_cost', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    });
    await queryInterface.addColumn('vendor_item', 'average_land_cost', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    });
      await queryInterface.addColumn('vendor_item', 'last_cost', {
      type: Sequelize.DECIMAL(10,2),
      allowNull: true
    });
      await queryInterface.addColumn('vendor_item', 'last_land_cost', {
      type: Sequelize.DECIMAL(10,2),
      allowNull: true
    });


  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('vendor_item', 'buyer');
    await queryInterface.removeColumn('vendor_item', 'buyer_type');
    await queryInterface.removeColumn('vendor_item', 'seasonal_adj');
    await queryInterface.removeColumn('vendor_item', 'last_warning_date');
    await queryInterface.removeColumn('vendor_item', 'calendar_year_hits');
    await queryInterface.removeColumn('vendor_item', 'last_12_month_hits');
    await queryInterface.removeColumn('vendor_item', 'average_lead_time');
    await queryInterface.removeColumn('vendor_item', 'cost_per');
    await queryInterface.removeColumn('vendor_item', 'cost_uom');
    await queryInterface.removeColumn('vendor_item', 'fut_std');
    await queryInterface.removeColumn('vendor_item', 'fut_effective');
    await queryInterface.removeColumn('vendor_item', 'average_cost');
    await queryInterface.removeColumn('vendor_item', 'average_land_cost');
    await queryInterface.removeColumn('vendor_item', 'last_cost');
    await queryInterface.removeColumn('vendor_item', 'last_land_cost');
  }
};
