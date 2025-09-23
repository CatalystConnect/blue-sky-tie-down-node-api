module.exports = (sequelize, Sequelize) => {
  const leadTags = sequelize.define(
    "lead_tags",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      lead_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      tag_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
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

  return leadTags;
};
