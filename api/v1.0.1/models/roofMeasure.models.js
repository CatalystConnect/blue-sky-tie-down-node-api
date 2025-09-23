module.exports = (sequelize, Sequelize) => {
    const roofMeasure = sequelize.define(
        "roofMeasure",
        {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            leadId: {
                type: Sequelize.INTEGER,
            },
            roofArea: {
                type: Sequelize.STRING,
            },
            predominantPitch: {
                type: Sequelize.STRING,
            },
            ridges: {
                type: Sequelize.STRING,
            },
            hips: {
                type: Sequelize.STRING,
            },
            valleys: {
                type: Sequelize.STRING,
            },
            rakes: {
                type: Sequelize.STRING,
            },
            eaves: {
                type: Sequelize.STRING,
            },
            bends: {
                type: Sequelize.STRING,
            },
            wallFlash: {
                type: Sequelize.STRING,
            },
            step: {
                type: Sequelize.STRING,
            },
            dripEdge: {
                type: Sequelize.STRING,
            },
            starter: {
                type: Sequelize.STRING,
            }
        },
        { timestamps: true, freezeTableName: true }
    );
    return roofMeasure;
};
