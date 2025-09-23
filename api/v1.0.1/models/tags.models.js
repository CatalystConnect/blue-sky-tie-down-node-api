module.exports = (sequelize, Sequelize) => {
    const tags = sequelize.define(
      "tags",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        title: {                
            type: Sequelize.STRING(255),
            allowNull: true,      
          },
          color: {
            type: Sequelize.STRING(255),
            allowNull: true,
          },
          type: {
            type: Sequelize.STRING(255),
            allowNull: true,
          },
        created_at: {
          type: Sequelize.DATE,
        },
        updated_at: {
          type: Sequelize.DATE,
        },
        deleted_at: {
          type: Sequelize.DATE,
        },
      },
      {
        timestamps: true,        
        createdAt: "created_at",
        updatedAt: "updated_at",
        paranoid: true,         
        deletedAt: "deleted_at",
        freezeTableName: true,  
             
      }
    );
  
    return tags;
  };
  