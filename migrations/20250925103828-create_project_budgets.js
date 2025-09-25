'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable('project_budgets', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      site_name: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      project_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true
      },
      sill_plate: { type: Sequelize.STRING(255), allowNull: true },
      tie_down: { type: Sequelize.STRING(255), allowNull: true },
      sw_misc: { type: Sequelize.STRING(255), allowNull: true },
      up_lift: { type: Sequelize.STRING(255), allowNull: true },
      roof: { type: Sequelize.STRING(255), allowNull: true },
      coridor: { type: Sequelize.STRING(255), allowNull: true },
      deck: { type: Sequelize.STRING(255), allowNull: true },
      stair_wells: { type: Sequelize.STRING(255), allowNull: true },
      beam: { type: Sequelize.STRING(255), allowNull: true },
      smu: { type: Sequelize.STRING(255), allowNull: true },
      stl: { type: Sequelize.STRING(255), allowNull: true },
      rtu: { type: Sequelize.STRING(255), allowNull: true },
      budget_total: { type: Sequelize.STRING(255), allowNull: true },
      sqft_sw_tiedown: { type: Sequelize.STRING(255), allowNull: true },
      sqft_up_lift: { type: Sequelize.STRING(255), allowNull: true },
      sqft_sill_plate: { type: Sequelize.STRING(255), allowNull: true },
      sqft_misc_hardware: { type: Sequelize.STRING(255), allowNull: true },
      cost_sw_tiedown: { type: Sequelize.STRING(255), allowNull: true },
      cost_up_lift: { type: Sequelize.STRING(255), allowNull: true },
      cost_sill_plate: { type: Sequelize.STRING(255), allowNull: true },
      cost_misc_hardware: { type: Sequelize.STRING(255), allowNull: true },
      total: { type: Sequelize.STRING(255), allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: true },
      updated_at: { type: Sequelize.DATE, allowNull: true },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
      posts: { type: Sequelize.STRING(255), allowNull: true },
      misc: { type: Sequelize.STRING(255), allowNull: true },

      // Decimal columns
      cost_roof: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      cost_coridor: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      cost_deck: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      cost_stair_wells: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      cost_beam: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      cost_posts: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      cost_smu: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      cost_stl: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      cost_misc: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      cost_rtu: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      
      costType_sw_tiedown: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      costType_sill_plate: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      costType_up_lift: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      costType_misc_hardware: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      costType_roof: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      costType_coridor: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      costType_deck: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      costType_stair_wells: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      costType_beam: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      costType_posts: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      costType_smu: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      costType_stl: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      costType_misc: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      costType_rtu: { type: Sequelize.DECIMAL(20,4), allowNull: true },

      price_sill_plate: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      price_sw_tiedown: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      price_up_lift: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      price_misc_hardware: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      price_roof: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      price_coridor: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      price_deck: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      price_stair_wells: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      price_beam: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      price_posts: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      price_smu: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      price_stl: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      cmu: { type: Sequelize.DECIMAL(10,0), allowNull: true },
      price_misc: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      price_rtu: { type: Sequelize.DECIMAL(20,4), allowNull: true },

      priceType_sill_plate: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      priceType_sw_tiedown: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      priceType_up_lift: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      priceType_misc_hardware: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      priceType_roof: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      priceType_coridor: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      priceType_deck: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      priceType_stair_wells: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      priceType_beam: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      priceType_posts: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      priceType_smu: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      priceType_stl: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      priceType_misc: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      priceType_rtu: { type: Sequelize.DECIMAL(20,4), allowNull: true },

      costType_Total: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      price_total: { type: Sequelize.DECIMAL(20,4), allowNull: true },
      priceType_total: { type: Sequelize.DECIMAL(20,4), allowNull: true },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('project_budgets');
  }
};
