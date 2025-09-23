module.exports = (sequelize, Sequelize) => {
  const itemImages = sequelize.define(
    "item_images",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      file: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      file_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "item_images",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return itemImages;
};
