module.exports = (sequelize, DataTypes) => {
    const Item = sequelize.define(
      "items",
      {
        id: {
          type: DataTypes.BIGINT.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        sku: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        image: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        short_description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        description: {
          type: DataTypes.TEXT("long"),
          allowNull: true,
        },
        website_id: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        freeform: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        meta: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        title_tag: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        meta_description: {
          type: DataTypes.TEXT("long"),
          allowNull: true,
        },
        status: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        deleted_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        brand_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        service: {
          type: DataTypes.STRING(255),
          allowNull: true,
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
  
    return Item;
  };
  