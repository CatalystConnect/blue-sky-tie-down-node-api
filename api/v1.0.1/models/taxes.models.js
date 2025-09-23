module.exports = (sequelize, Sequelize) => {
  const taxes = sequelize.define(
    "taxes",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(255),
      },
      rate: {
        type: Sequelize.STRING(255),
      },
      zipcode: {
        type: Sequelize.STRING(255),
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    },
    {
      timestamps: true,
    }
  );

  return taxes;
};
