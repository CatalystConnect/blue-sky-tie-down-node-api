module.exports = (sequelize, Sequelize) => {
  const itemUnits = sequelize.define(
    "item_units",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      um: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      qty: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      per: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      upc: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      height: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      weight: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      length: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      isDefault: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isBase: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      width: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      unit_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      per_unit_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      // per_unit: {
      //   type: Sequelize.STRING(255),
      //   allowNull: true,
      // },
      price: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      unit_type: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      conversionMatrix: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      volume: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
      paranoid: true,
      tableName: "item_units",
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return itemUnits;
};
