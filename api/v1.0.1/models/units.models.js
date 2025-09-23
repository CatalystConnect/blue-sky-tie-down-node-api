module.exports = (sequelize, DataTypes) => {
    const Unit = sequelize.define(
      "Unit",
      {
        id: {
          type: DataTypes.BIGINT, 
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        created_at: {
          type: DataTypes.DATE,
        },
        updated_at: {
          type: DataTypes.DATE,
        },
        deleted_at: {
          type: DataTypes.DATE,
        },
      },
      {
        tableName: "units",
        freezeTableName: true,
        timestamps: true,
        paranoid: true, 
        createdAt: "created_at",
        updatedAt: "updated_at",
        deletedAt: "deleted_at",
      }
    );
  
    return Unit;
  };
  
  