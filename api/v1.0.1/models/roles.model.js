module.exports = (sequelize, Sequelize) => {
    const roles = sequelize.define(
      "roles",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        role: {
          type: Sequelize.ENUM({
            values: ['sales', 'administrator','super_admin','qualified_contractor','quality_assurance_manager']
          }),
        },
        name: {
          type: Sequelize.STRING,
        }
      },
      { timestamps: true, freezeTableName: true }
    );
    return roles;
  };
  