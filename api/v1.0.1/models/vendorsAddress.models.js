module.exports = (sequelize, Sequelize) => {
    const vendorAddress = sequelize.define(
      "vendor_address",
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
        address_type: {
          type: Sequelize.ENUM("MAIN", "REMIT_TO", "SHIP_FROM", "RETURNS"),
          allowNull: false,
        },
        is_default: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        street_1: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        street_2: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        state: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        postal_code: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        country_code: {
          type: Sequelize.STRING(2),
          allowNull: false,
        },  
        
      },
      {
        timestamps: true,           
        freezeTableName: true,  
        underscored: true       
      }
    );
  
    return vendorAddress;
  };
  