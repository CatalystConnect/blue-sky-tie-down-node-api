module.exports = (sequelize, Sequelize) => {
  const projectPhases = sequelize.define(
    "project_phases",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
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

  return projectPhases;
};
