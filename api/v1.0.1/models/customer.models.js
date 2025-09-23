module.exports = (sequelize, Sequelize) => {
    const customer = sequelize.define(
        "customer",
        {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            firstName: {
                type: Sequelize.STRING,
            },
            lastName: {
                type: Sequelize.STRING,
            },
            email: {
                type: Sequelize.STRING,
            },
            phone: {
                type: Sequelize.STRING,
            },
            customerLocation: {
                type: Sequelize.STRING,
            },
            address: {
                type: Sequelize.STRING,
            },
            city: {
                type: Sequelize.STRING,
            },
            state: {
                type: Sequelize.STRING,
            },
            zip: {
                type: Sequelize.STRING,
            }
        },
        { timestamps: true, freezeTableName: true }
    );
    return customer;
};
