module.exports = (sequelize, Sequelize) => {
  const workOrder = sequelize.define(
    "workOrder",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      materialId: {
        type: Sequelize.STRING,
      },
      projectId: {
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
      },
      workOrder: {
        type: Sequelize.STRING,
      },
      workingCategory: {
        type: Sequelize.STRING,
      },
      startDate: {
        type: Sequelize.STRING,
      },
      finishDate: {
        type: Sequelize.STRING,
      },
      startingPrice: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      location: {
        type: Sequelize.STRING,
      },
      latitude: {
        type: Sequelize.STRING,
      },
      longitude: {
        type: Sequelize.STRING,
      },
      offerBox: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.STRING,
      },
      region: {
        type: Sequelize.INTEGER,
      },
      leadAddress: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      state: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      zip: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
      bidStatus: {
        type: Sequelize.ENUM("accept","reject"),
      }
      // publishTo: {
      //   type: Sequelize.STRING,
      // },
      // inviteContact: {
      //   type: Sequelize.STRING,
      // }

    },
    { timestamps: true, freezeTableName: true }
  );
  return workOrder;
};
