module.exports = (sequelize, Sequelize) => {
    const contract = sequelize.define(
        "contract",
        {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            contractorName: {
                type: Sequelize.STRING,
            },
            logo: {
                type: Sequelize.STRING,
            },
            contractorPhone: {
                type: Sequelize.STRING,
            },
            contractorAddress: {
                type: Sequelize.STRING,
            },
            contractorCity: {
                type: Sequelize.STRING,
            },
            contractorState: {
                type: Sequelize.STRING,
            },
            contractorZip: {
                type: Sequelize.STRING,
            },
            contractorEmail: {
                type: Sequelize.STRING,
            },
            contacts: {
                type: Sequelize.STRING,
            },
            ativities: {
                type: Sequelize.STRING,
            },
            gaf: {
                type: Sequelize.STRING,
            },
            gafCertifications: {
                type: Sequelize.STRING,
            },
            gafRating: {
                type: Sequelize.STRING,
            },
            gafReviews: {
                type: Sequelize.STRING,
            },
            certineed: {
                type: Sequelize.STRING,
            },
            certineedCertifications: {
                type: Sequelize.STRING,
            },
            certineedRating: {
                type: Sequelize.STRING,
            },
            certineedReviews: {
                type: Sequelize.STRING,
            },
            owensCoring: {
                type: Sequelize.STRING,
            },
            owensCoringCertifications: {
                type: Sequelize.STRING,
            },
            owensCoringRating: {
                type: Sequelize.STRING,
            },
            owensCoringReviews: {
                type: Sequelize.STRING,
            },
            leadScore: {
                type: Sequelize.STRING,
            },
            leadSource: {
                type: Sequelize.STRING,
            },
            qualifiedContractorFormStarted: {
                type: Sequelize.STRING,
            },
            qualifiedContractorFormSubmitted: {
                type: Sequelize.STRING,
            },
            qualifiedContractorFormApproove: {
                type: Sequelize.STRING,
            },
            notes: {
                type: Sequelize.STRING,
            },
            status: {
                type: Sequelize.STRING,
            },
            internalNotes: {
                type: Sequelize.STRING,
            },
            leadCompleteScore: {
                type: Sequelize.STRING,
            },
            regionalZipCode: {
                type: Sequelize.STRING,
            },
            contractorRegion: {
                type: Sequelize.STRING,
            },
            duplicateRecord: {
                type: Sequelize.BOOLEAN,
            },
            refId: {
                type: Sequelize.STRING,
            },
            contractStatus: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false, 
            },
            contractSignature: {
                type: Sequelize.STRING,
                allowNull: true,
               
            },
            qualifiedContractors: {
                type: Sequelize.STRING,
                defaultValue: "false", 
            },
        },
        { timestamps: true, freezeTableName: true }
    );
    return contract;
};
