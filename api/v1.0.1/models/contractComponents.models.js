module.exports = (sequelize, Sequelize) => {
  const contractComponents = sequelize.define(
    "contract_components",
    {
       id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
    },
    {
      timestamps: true,
      // freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true,
      deletedAt: "deleted_at",
      underscored: true,

    }
  );

  return contractComponents;
};
