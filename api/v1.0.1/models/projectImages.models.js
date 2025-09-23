module.exports = (sequelize, Sequelize) => {
  const itemImages = sequelize.define(
    "projectImages",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      lead_id: {
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
      image_type: {
        type: Sequelize.STRING,
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
      paranoid: true,
      underscored: true,
      tableName: "projectImages",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return itemImages;
};
