module.exports = (sequelize, Sequelize) => {
  const ItemWeb = sequelize.define(
    "item_webs",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      category: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      sequence: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
    },
    {
      timestamps: true, 
      freezeTableName: true,
      tableName: "item_webs",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return ItemWeb;
};
