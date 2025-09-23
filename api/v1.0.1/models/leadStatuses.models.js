module.exports = (sequelize, Sequelize) => {
  const LeadStatus = sequelize.define(
    "lead_statuses",
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
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
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

  return LeadStatus;
};
