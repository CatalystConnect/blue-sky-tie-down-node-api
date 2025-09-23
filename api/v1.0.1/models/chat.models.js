module.exports = (sequelize, Sequelize) => {
    const chat = sequelize.define(
      "chat",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        senderId: {
          type: Sequelize.INTEGER,
        },
        recieverId: {
          type: Sequelize.INTEGER,
        },
        message: {
            type: Sequelize.TEXT,
        },
        module:{
          type: Sequelize.STRING,
        },
        moduleId:{
          type: Sequelize.INTEGER,
        },
        read: {
            type: Sequelize.BOOLEAN,
        }
      },
      { timestamps: true, freezeTableName: true }
    );
    return chat;
  };
  