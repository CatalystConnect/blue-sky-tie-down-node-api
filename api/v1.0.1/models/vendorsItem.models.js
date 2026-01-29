module.exports = (sequelize, Sequelize) => {
  const vendorItem = sequelize.define(
    "vendor_item",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      vendor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      vendor_part_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      vendor_description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      default_unit_cost: {
        type: Sequelize.DECIMAL(19, 4),
        allowNull: true,
      },
      currency_code: {
        type: Sequelize.STRING(3),
        allowNull: true,
      },

      purchase_uom: {
        type: Sequelize.STRING,
        allowNull: true,
      },


      future_effective_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },


      min_order_qty: {
        type: Sequelize.DECIMAL(18, 6),
        allowNull: true,
      },

      order_multiple_qty: {
        type: Sequelize.DECIMAL(18, 6),
        allowNull: true,
      },

      lead_time_days: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      standard_lead_time_days: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },


      is_preferred_vendor: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      ranking: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },


      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: true,

      },
      buyer: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      buyer_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      seasonal_adj: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },

      last_warning_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      calendar_year_hits: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      last_12_month_hits: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      average_lead_time: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      cost_per: {
        type: Sequelize.DECIMAL(19, 4),
        allowNull: true,
      },

      cost_uom: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      fut_std: {
        type: Sequelize.DECIMAL(19, 4),
        allowNull: true,
      },

      fut_effective: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },

      average_cost: {
        type: Sequelize.DECIMAL(19, 4),
        allowNull: true,
      },

      // average_landed_cost: {
      //   type: Sequelize.DECIMAL(19, 4),
      //   allowNull: true,
      // },

      last_land_cost: {
        type: Sequelize.DECIMAL(19, 4),
        allowNull: true,
      },

      last_cost: {
        type: Sequelize.DECIMAL(19, 4),
        allowNull: true,
      },

      last_land_cost: {
        type: Sequelize.DECIMAL(19, 4),
        allowNull: true,
      },


    },
    {
      timestamps: true,
      freezeTableName: true,
      underscored: true
    }
  );

  return vendorItem;
};
