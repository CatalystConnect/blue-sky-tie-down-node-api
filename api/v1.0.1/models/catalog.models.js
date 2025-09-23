module.exports = (sequelize, Sequelize) => {
    const catalog = sequelize.define(
        "catalog",
        {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            productName: {
                type: Sequelize.STRING,
            },
            grade: {
                type: Sequelize.STRING,
            },
            type: {
                type: Sequelize.ENUM('Asphalt Shingle', 'Wood', 'Tile', 'Metal', 'Synthetic')
            },
            waranty: {
                type: Sequelize.STRING,
            },
            features: {
                type: Sequelize.ENUM('Designer Style', 'Storm Resistance', 'Quick Install', 'Top Selling', 'Extended Warranty', 'Algae Protection', 'Energy Star Certified', 'Most Popular')
            },
            price: {
                type: Sequelize.STRING,
            },
            topFeatures: {
                type: Sequelize.TEXT,
            },
            installationPackage: {
                type: Sequelize.TEXT,
            },
            specificationsDescription: {
                type: Sequelize.TEXT,
            },
            keySpecifications: {
                type: Sequelize.JSON,
            },
            description: {
                type: Sequelize.TEXT,
            },
            manufacturer: {
                type: Sequelize.STRING,
            }
        },
        { timestamps: true, freezeTableName: true }
    );
    return catalog;
};
