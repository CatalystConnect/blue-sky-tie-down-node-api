module.exports = (sequelize, Sequelize) => {
  const gDriveAssociation = sequelize.define(
    "gDriveAssociation",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      module: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      module_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      drive_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      file_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      parent: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
       type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'file',
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      paranoid: false,
    }
  );

  return gDriveAssociation;
};
