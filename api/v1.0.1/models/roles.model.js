module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define(
    "roles",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      guard_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      is_hidden: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      access: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: true,        
      freezeTableName: true,   
      paranoid: true,          
      createdAt: "created_at",  
      updatedAt: "updated_at",  
      deletedAt: "deleted_at",  
    }
  );
  return Role;
};
