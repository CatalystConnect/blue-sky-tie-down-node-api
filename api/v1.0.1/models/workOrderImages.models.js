module.exports = (sequelize, Sequelize) => {
    const WorkOrderImages = sequelize.define(
      "WorkOrderImages",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        workOrderId: {
            type: Sequelize.INTEGER,
        },
        image: {
          type: Sequelize.STRING,
        }
      },
      { timestamps: true, freezeTableName: true }
    );
    return WorkOrderImages;
  };
  