module.exports = (sequelize, Sequelize) => {
  const workOrderCategories = sequelize.define(
    "workOrderCategories",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      category: {
        type: Sequelize.STRING,
      }
    },
    { timestamps: true, freezeTableName: true }
  );
  return workOrderCategories;
};
