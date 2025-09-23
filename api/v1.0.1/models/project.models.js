module.exports = (sequelize, Sequelize) => {
    const project = sequelize.define(
        "project",
        {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            projectName: {
                type: Sequelize.STRING,
            },
            latitude: {
                type: Sequelize.STRING,
            },
            longitude: {
                type: Sequelize.STRING,
            },
            price: {
                type: Sequelize.STRING,
            },
            address: {
                type: Sequelize.STRING,
            },
            state: {
                type: Sequelize.STRING,
            },
            city: {
                type: Sequelize.STRING,
            },
            zip: {
                type: Sequelize.STRING,
            },
            scope: {
                type: Sequelize.STRING,
            },
            description: {
                type: Sequelize.STRING,
            },
            location: {
                type: Sequelize.STRING,
            }
        },
        { timestamps: true, freezeTableName: true }
    );
    return project;
};
