module.exports = (sequelize, Sequelize) => {
  const Vendor = sequelize.define(
    "vendors",
    {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      bill_to: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      ship_to: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      vendor_code: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      dba_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tax_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_1099_eligible: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      payment_terms_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      incoterm_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      freight_terms: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      default_shipping_method_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      vendor_address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      state: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "HOLD", "INACTIVE"),
        allowNull: true,
        defaultValue: "ACTIVE",
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
      underscored: true
    }
  );

  return Vendor;
};
