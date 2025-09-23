module.exports = (sequelize, Sequelize) => {
    const activities = sequelize.define(
      "activities",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: Sequelize.INTEGER,
        },
        moduleName: {
          type: Sequelize.STRING,
        },
        moduleId: {
          type: Sequelize.INTEGER,
        },
        oldValue: {
          type: Sequelize.STRING,
        },
        newValue: {
            type: Sequelize.STRING,
          },
        description: {
          type: Sequelize.TEXT,
        },
        isDeleted: {
          type: Sequelize.STRING,
        }
      },
      { timestamps: true, freezeTableName: true }
    );
    return activities;
  };
  