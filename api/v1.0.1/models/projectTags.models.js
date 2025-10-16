module.exports = (sequelize, Sequelize) => {
  const projectTags = sequelize.define(
    "project_tags",
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

  return projectTags;
};
