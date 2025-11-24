module.exports = (sequelize, Sequelize) => {
  const company = sequelize.define(
    "companies",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      company_type: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      state: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      city: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      zip: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      company_notes: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      company_lead_score: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      tax: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return company;
};
