'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('item_units', 'isDefault', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn('item_units', 'isBase', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn('item_units', 'price', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 0,
    });
    await queryInterface.addColumn('item_units', 'unit_type', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    await queryInterface.addColumn('item_units', 'conversionMatrix', {
      type: Sequelize.JSONB, 
      allowNull: true,
    });
    await queryInterface.addColumn('item_units', 'volume', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('item_units', 'isDefault');
    await queryInterface.removeColumn('item_units', 'isBase');
    await queryInterface.removeColumn('item_units', 'price');
    await queryInterface.removeColumn('item_units', 'unit_type');
    await queryInterface.removeColumn('item_units', 'conversionMatrix');
    await queryInterface.removeColumn('item_units', 'volume');

  }
};
