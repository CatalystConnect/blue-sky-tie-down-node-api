module.exports = (sequelize, Sequelize) => {
    const verifiedContractors = sequelize.define(
      "verifiedContractors",
      {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        contractorId: {
            type: Sequelize.INTEGER,
        },
        doc1Name: {
            type: Sequelize.STRING,
        },
        doc1File: {
            type: Sequelize.STRING,
        },
        doc1Status: {
            type: Sequelize.ENUM("approved", "rejected","pending for approoval","documentUploaded", "notSubmited"),
            defaultValue: "documentUploaded"
        },
        doc1Note: {
            type: Sequelize.TEXT,
        },
        doc2Name: {
            type: Sequelize.STRING,
        },
        doc2File: {
            type: Sequelize.STRING,
        },
        doc2Status: {
            type: Sequelize.ENUM("approved", "rejected","pending for approoval","documentUploaded"),
            defaultValue: "documentUploaded"
        },
        doc2Note: {
            type: Sequelize.TEXT,
        },
        doc3Name: {
            type: Sequelize.STRING,
        },
        doc3File: {
            type: Sequelize.STRING,
        },
        doc3Status: {
            type: Sequelize.ENUM("approved", "rejected","pending for approoval","documentUploaded"),
            defaultValue: "documentUploaded"
        },
        doc3Note: {
            type: Sequelize.TEXT,
        },
        doc4Name: {
            type: Sequelize.STRING,
        },
        doc4File: {
            type: Sequelize.STRING,
        },
        doc4Status: {
            type: Sequelize.ENUM("approved", "rejected","pending for approoval","documentUploaded"),
            defaultValue: "documentUploaded"
        },
        doc4Note: {
            type: Sequelize.TEXT,
        },
        doc5Name: {
            type: Sequelize.STRING,
        },
        doc5File: {
            type: Sequelize.STRING,
        },
        doc5Status: {
            type: Sequelize.ENUM("approved", "rejected","pending for approoval","documentUploaded"),
            defaultValue: "documentUploaded"
        },
        doc5Note: {
            type: Sequelize.TEXT,
        },
        doc6Name: {
            type: Sequelize.STRING,
        },
        doc6File: {
            type: Sequelize.STRING,
        },
        doc6Status: {
            type: Sequelize.ENUM("approved", "rejected","pending for approoval","documentUploaded"),
            defaultValue: "documentUploaded"
        },
        doc6Note: {
            type: Sequelize.TEXT,
        },
        doc7Name: {
            type: Sequelize.STRING,
        },
        doc7File: {
            type: Sequelize.STRING,
        },
        doc7Status: {
            type: Sequelize.ENUM("approved", "rejected","pending for approoval","documentUploaded"),
            defaultValue: "documentUploaded"
        },
        doc7Note: {
            type: Sequelize.TEXT,
        },
        doc8Name: {
            type: Sequelize.STRING,
        },
        doc8File: {
            type: Sequelize.STRING,
        },
        doc8Status: {
            type: Sequelize.ENUM("approved", "rejected","pending for approoval","documentUploaded"),
            defaultValue: "documentUploaded"
        },
        doc8Note: {
            type: Sequelize.TEXT,
        },
        doc9Name: {
            type: Sequelize.STRING,
        },
        doc9File: {
            type: Sequelize.STRING,
        },
        doc9Status: {
            type: Sequelize.ENUM("approved", "rejected","pending for approoval","documentUploaded"),
            defaultValue: "documentUploaded"
        },
        doc9Note: {
            type: Sequelize.TEXT,
        },
        doc10Name: {
            type: Sequelize.STRING,
        },
        doc10File: {
            type: Sequelize.STRING,
        },
        doc10Status: {
            type: Sequelize.ENUM("approved", "rejected","pending for approoval","documentUploaded"),
            defaultValue: "documentUploaded"
        },
        doc10Note: {
            type: Sequelize.TEXT,
        },
        doc11Name: {
            type: Sequelize.STRING,
        },
        doc11File: {
            type: Sequelize.STRING,
        },
        doc11Status: {
            type: Sequelize.ENUM("approved", "rejected","pending for approoval","documentUploaded"),
            defaultValue: "documentUploaded"
        },
        doc11Note: {
            type: Sequelize.TEXT,
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
        }
      },
      { timestamps: true, freezeTableName: true }
    );
    return verifiedContractors;
  };
  