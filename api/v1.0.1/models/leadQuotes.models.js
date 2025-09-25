module.exports = (sequelize, Sequelize) => {
  const leadQuotes = sequelize.define(
    "lead_quotes",
    {
       id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      lead_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      quote_status_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      quote: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      quote_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      amount: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      file: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      file_name: {
        type: Sequelize.STRING(255),
        allowNull: true
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
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true,
      deletedAt: "deleted_at",
    }
  );

  return leadQuotes;
};
