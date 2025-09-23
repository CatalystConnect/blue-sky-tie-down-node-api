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
  