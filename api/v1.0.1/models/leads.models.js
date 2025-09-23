module.exports = (sequelize, Sequelize) => {
  const leads = sequelize.define(
    "leads",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      lattitude: {
        type: Sequelize.STRING,
      },
      longitude: {
        type: Sequelize.STRING,
      },
      date: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      scope: {
        type: Sequelize.JSON,
      },
      state: {
        type: Sequelize.STRING,
      },
      zip: {
        type: Sequelize.STRING,
      },
      firstName: {
        type: Sequelize.STRING,
      },
      lastName: {
        type: Sequelize.STRING,
      },
      customerAddress: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      leadsAge: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      checkBoxAddress: {
        type: Sequelize.BOOLEAN,
      },
      customerCity: {
        type: Sequelize.STRING,
      },
      customerLongitude: {
        type: Sequelize.STRING,
      },
      customerLatitude: {
        type: Sequelize.STRING,
      },
      customerZip: {
        type: Sequelize.STRING,
      },
      customerState: {
        type: Sequelize.STRING,
      },
      leadLocation: {
        type: Sequelize.STRING,
      },
      salesPerson: {
        type: Sequelize.INTEGER,
      },
      salesTeam: {
        type: Sequelize.INTEGER,
      },
      region: {
        type: Sequelize.JSONB,
      },
      dateOfFirstContact: {
        type: Sequelize.STRING,
      },
      preferredContractor: {
        type: Sequelize.INTEGER,
      },
      estimatedDealValue: {
        type: Sequelize.TEXT,
      },
      leadContractStatus: {
        type: Sequelize.STRING,
      },
      customerId: {
        type: Sequelize.INTEGER,
      },
    },
    { timestamps: true, freezeTableName: true }
  );
  return leads;
};
