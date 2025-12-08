module.exports = (sequelize, Sequelize) => {
  const vendorContact = sequelize.define(
    "vendor_contact",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      vendor_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      role_tags: {
        type: Sequelize.JSON,
        allowNull: true,
      },

    },
    {
      timestamps: true,
      freezeTableName: true,
      underscored: true
    }
  );

  return vendorContact;
};
