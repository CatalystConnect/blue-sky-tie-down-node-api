module.exports = (sequelize, Sequelize) => {
    const applyWorkOrder = sequelize.define(
      "applyWorkOrder",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        workOrderId: {
          type: Sequelize.INTEGER,
        },
        contractorId: {
          type: Sequelize.INTEGER,
        },
        description: {
          type: Sequelize.TEXT('medium'),
        },
        image: {
          type: Sequelize.STRING,
        },
        projectName:{
          type: Sequelize.STRING,
        },
        projectLocation:{
          type: Sequelize.STRING,
        },
        bidDate:{
          type: Sequelize.STRING,
        },
        labourCost:{
          type: Sequelize.STRING,
        },
        totalEstimatedCost:{
          type: Sequelize.STRING,
        },
        startDate:{
          type: Sequelize.STRING,
        },
        completionDate:{
          type: Sequelize.STRING,
        },
        status:{
          type: Sequelize.ENUM("accept","reject"),
        },
      },
      { timestamps: true, freezeTableName: true }
    );
    return applyWorkOrder;
  };
  