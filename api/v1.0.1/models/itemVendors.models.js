module.exports = (sequelize, Sequelize) => {
  const itemVendors = sequelize.define(
    "item_vendors",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      item_id: {
        type: Sequelize.INTEGER,
      },
      vendor_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      item: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      cost: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      uom: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      cost_per_each: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      comment: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      is_stocked: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      unit_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "item_vendors",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return itemVendors;
};
