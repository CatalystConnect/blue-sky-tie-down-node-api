module.exports = (sequelize, Sequelize) => {
    const notes = sequelize.define(
      "notes",
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
        description: {
          type: Sequelize.TEXT,
        },
        isDeleted: {
          type: Sequelize.STRING,
        }
      },
      { timestamps: true, freezeTableName: true }
    );
    return notes;
  };
  