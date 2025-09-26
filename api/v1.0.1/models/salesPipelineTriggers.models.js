module.exports = (sequelize, Sequelize) => {
  const salesPipelineTriggers = sequelize.define(
    "sales_pipeline_triggers",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      sales_pipeline_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      type: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      field_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      field_value: {
        type: Sequelize.INTEGER,
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

  return salesPipelineTriggers;
};
