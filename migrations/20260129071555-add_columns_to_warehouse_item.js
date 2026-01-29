'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('warehouse_item', 'safety_stock', {
      type: Sequelize.INTEGER,
      allowNull: true,

    });
    await queryInterface.addColumn('warehouse_item', 'usage_months', {
      type: Sequelize.INTEGER,
      allowNull: true,

    });
    await queryInterface.addColumn('warehouse_item', 'classification', {
      type: Sequelize.ENUM('A', 'B', 'C'),
      allowNull: true,

    });
    await queryInterface.addColumn('warehouse_item', 'class_by_hits', {
      type: Sequelize.ENUM('A', 'B', 'C'),
      allowNull: true,

    });
    await queryInterface.addColumn('warehouse_item', 'purchase_multiple', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('warehouse_item', 'purchase_minimum', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('warehouse_item', 'avg_monthly_usage', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    });
    await queryInterface.addColumn('warehouse_item', 'trans_avg_mult', {
      type: Sequelize.DECIMAL(6, 2),
      allowNull: true
    });
    await queryInterface.addColumn('warehouse_item', 'last_warning_date', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('warehouse_item', 'replacement_r_cost', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true
    });
    await queryInterface.addColumn('warehouse_item', 'carrying_k_cost', {
      type: Sequelize.DECIMAL(6, 2),
      allowNull: true,
    });
    await queryInterface.addColumn('warehouse_item', 'calendar_year_hits', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('warehouse_item', 'last_12_month_hits', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('warehouse_item', 'calculation_method', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('warehouse_item', 'min_mult', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('warehouse_item', 'max_mult', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('warehouse_item', 'min_max_mode', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('warehouse_item', 'eoq', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('warehouse_item', 'order_point', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('warehouse_item', 'line_point', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('warehouse_item', 'warn_qty', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('warehouse_item', 'last_cost', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true
    });
    await queryInterface.addColumn('warehouse_item', 'cost_per', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('warehouse_item', 'working_cost', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true
    });
    await queryInterface.addColumn('warehouse_item', 'costing_method', {
      type: Sequelize.ENUM('FIFO', 'LIFO', 'AVERAGE', 'STANDARD'),
      allowNull: true
    });
    await queryInterface.addColumn('warehouse_item', 'land_working_cost', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true
    });

    await queryInterface.addColumn('warehouse_item', 'land_last_cost', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true
    });
    await queryInterface.addColumn('warehouse_item', 'land_avg_cost', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true
    });
    await queryInterface.addColumn('warehouse_item', 'current_cost_difference', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true
    });


  },

  async down(queryInterface, Sequelize) {
   await queryInterface.removeColumn('warehouse_item', 'safety_stock');
    await queryInterface.removeColumn('warehouse_item', 'usage_months');
    await queryInterface.removeColumn('warehouse_item', 'classification');
    await queryInterface.removeColumn('warehouse_item', 'class_by_hits');
    await queryInterface.removeColumn('warehouse_item', 'purchase_multiple');
    await queryInterface.removeColumn('warehouse_item', 'purchase_minimum');
    await queryInterface.removeColumn('warehouse_item', 'avg_monthly_usage');
    await queryInterface.removeColumn('warehouse_item', 'trans_avg_mult');
    await queryInterface.removeColumn('warehouse_item', 'last_warning_date');
    await queryInterface.removeColumn('warehouse_item', 'replacement_r_cost');
    await queryInterface.removeColumn('warehouse_item', 'carrying_k_cost');
    await queryInterface.removeColumn('warehouse_item', 'calendar_year_hits');
    await queryInterface.removeColumn('warehouse_item', 'last_12_month_hits');
    await queryInterface.removeColumn('warehouse_item', 'calculation_method');
    await queryInterface.removeColumn('warehouse_item', 'min_mult');
    await queryInterface.removeColumn('warehouse_item', 'max_mult');
    await queryInterface.removeColumn('warehouse_item', 'min_max_mode');
    await queryInterface.removeColumn('warehouse_item', 'eoq');
    await queryInterface.removeColumn('warehouse_item', 'order_point');
    await queryInterface.removeColumn('warehouse_item', 'line_point');
    await queryInterface.removeColumn('warehouse_item', 'warn_qty');
    await queryInterface.removeColumn('warehouse_item', 'last_cost');
    await queryInterface.removeColumn('warehouse_item', 'cost_per');
    await queryInterface.removeColumn('warehouse_item', 'working_cost');
    await queryInterface.removeColumn('warehouse_item', 'costing_method');
    await queryInterface.removeColumn('warehouse_item', 'land_working_cost');
    await queryInterface.removeColumn('warehouse_item', 'land_last_cost');
    await queryInterface.removeColumn('warehouse_item', 'land_avg_cost');
    await queryInterface.removeColumn('warehouse_item', 'current_cost_difference');
  }
};
