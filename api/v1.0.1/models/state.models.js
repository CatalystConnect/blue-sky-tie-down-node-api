module.exports = (sequelize, Sequelize) => {
  const state = sequelize.define(
    "state",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
       order: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
     
    },
    {
      timestamps: true,          
      freezeTableName: true,     
      createdAt: "created_at",   
      updatedAt: "updated_at",   
      paranoid: false,         
      
    }
  );

  return state;
};
