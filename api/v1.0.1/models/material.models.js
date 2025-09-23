module.exports = (sequelize, Sequelize) => {
    const material = sequelize.define(
      "material",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        customerName: {
          type: Sequelize.STRING,
        },
        shipTo: {
          type: Sequelize.STRING,
        },
        additionalTotal: {
          type: Sequelize.STRING,
        },
        materialTotal: {
          type: Sequelize.STRING,
        },
        addtaxable: {
          type: Sequelize.STRING,
        },
        customerEmail: {
          type: Sequelize.STRING,
        },
        customerPhone: {
          type: Sequelize.STRING,
        },
        status: {
          type: Sequelize.ENUM("pending","approved","reject")
        }
      },
      { timestamps: true, freezeTableName: true }
    );
    return material;
  };
  