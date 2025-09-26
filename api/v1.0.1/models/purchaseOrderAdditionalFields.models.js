module.exports = (sequelize, Sequelize) => {
  const purchaseOrderAdditionalFields = sequelize.define(
    "purchase_order_additional_fields",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      purchase_order_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      field1: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: true,
      },
      field2: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: true,
      },
      field3: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: true,
      },
      field4: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true,
      deletedAt: "deleted_at",
    }
  );

  return purchaseOrderAdditionalFields;
};
