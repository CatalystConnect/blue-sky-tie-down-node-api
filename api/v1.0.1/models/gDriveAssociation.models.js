module.exports = (sequelize, Sequelize) => {
  const gDriveAssociation = sequelize.define(
    "gDriveAssociation",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      parent: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      module: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      module_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      drive_id: {
        type: Sequelize.STRING,
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

  return gDriveAssociation;
};
