module.exports = (sequelize, Sequelize) => {
  const purchaseOrderItem = sequelize.define(
    "purchase_order_item",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      poId: {
        type: Sequelize.INTEGER,
        allowNull: true,

      },
      po_line_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      warehouse_item_id: {
        type: Sequelize.INTEGER,
        allowNull: true,

      },
      on_order: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      back_order: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      requested_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },

      order_tool: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      warehouse: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      cost_per: {
        type: Sequelize.DECIMAL(15, 4),
        allowNull: true,
      },

      exp_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },

      received_to_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },

      transfer_to_warehouse: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      origin: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      oe_linked: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },


      open_total: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
      },

      vessel: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      discount_pct: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },

      other: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      expected_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
      deletedAt: "deleted_at",
      // underscored: true
    }
  );

  return purchaseOrderItem;
};
