module.exports = (sequelize, Sequelize) => {
    const manufacturer = sequelize.define(
      "manufacturer",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        image: {
          type: Sequelize.STRING,
        },
        slug: {
          type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.ENUM('Active','In Active')         
        },
        title: {
          type: Sequelize.STRING,
        }
      },
      { timestamps: true, freezeTableName: true }
    );
    return manufacturer;
  };
  