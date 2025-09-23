module.exports = (sequelize, Sequelize) => {
    const takeOfQuotes = sequelize.define(
      "takeOfQuotes",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        leadId:  {
          type: Sequelize.INTEGER,
        },
        userId: {
          type: Sequelize.INTEGER,
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
        },
        materialQuality: {
          type: Sequelize.STRING,
        }
      },
      { timestamps: true, freezeTableName: true }
    );
    return takeOfQuotes;
  };
  