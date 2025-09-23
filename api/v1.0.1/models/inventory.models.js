module.exports = (sequelize, Sequelize) => {
    const inventory = sequelize.define(
        "inventory",
        {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            sku: {
                type: Sequelize.STRING,
            },
            brand: {
                type: Sequelize.STRING,
            },
            image: {
                type: Sequelize.STRING,
            },
            shortDescription: {
                type: Sequelize.STRING,
            },
            longDescription: {
                type: Sequelize.STRING,
            },
            units: {
                type: Sequelize.JSONB,
            },
            vendor: {
                type: Sequelize.JSONB,
            }
        },
        { timestamps: true, freezeTableName: true }
    );
    return inventory;
};
