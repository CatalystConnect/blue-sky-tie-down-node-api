require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const xlsx = require("xlsx");
var bcrypt = require("bcryptjs");
const contractServices = require("../services/contract.services");
const leadServices = require("../services/lead.services");
const authServices = require("../services/auth.services");
const activityServices = require("../services/activities.services");
const notesServices = require("../services/notes.services");
var jwt = require("jsonwebtoken");
const config = require("../../../config/db.config");
const { check, validationResult } = require("express-validator"); // Updated import
const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return error.msg;
    },
});
const db = require("../models");
module.exports = {
    /*addContract*/
    async addContract(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let data = req.body;
            const baseUrl = "/public/files/";
            const logo = req.file ? `${baseUrl}${req.file.filename}` : null;
            let totalContracts = await contractServices.totalContracts();
            const matchingRecords = totalContracts.filter(contract =>
                contract.contractorEmail === data.contractorEmail && contract.duplicateRecord !== true
            );
            let matchingData;
            let postData = {
                contractorName: data.contractorName,
                logo: logo,
                contractorPhone: data.contractorPhone,
                contractorAddress: data.contractorAddress,
                contractorCity: data.contractorCity,
                contractorState: data.contractorState,
                contractorZip: data.contractorZip,
                contractorEmail: data.contractorEmail,
                contacts: data.contacts,
                ativities: data.ativities,
                gaf: data.gaf,
                gafCertifications: data.gafCertifications,
                gafRating: data.gafRating,
                gafReviews: data.gafReviews,
                certineed: data.certineed,
                certineedCertifications: data.certineedCertifications,
                certineedRating: data.certineedRating,
                certineedReviews: data.certineedReviews,
                owensCoring: data.owensCoring,
                owensCoringCertifications: data.owensCoringCertifications,
                owensCoringRating: data.owensCoringRating,
                owensCoringReviews: data.owensCoringReviews,
                leadScore: data.leadScore,
                leadSource: data.leadSource,
                qualifiedContractorFormStarted: data.qualifiedContractorFormStarted,
                qualifiedContractorFormSubmitted: data.qualifiedContractorFormSubmitted,
                qualifiedContractorFormApproove: data.qualifiedContractorFormApproove,
                notes: data.notes,
                status: data.status,
                internalNotes: data.internalNotes,
                leadCompleteScore: data.leadCompleteScore,
                regionalZipCode: data.regionalZipCode,
                contractorRegion: data.contractorRegion,
                contractStatus: false
            }
            if (matchingRecords.length > 0) {
                matchingData = matchingRecords[0].id;
                postData.refId = matchingData,
                    postData.duplicateRecord = true
            }
            await contractServices.addContract(postData);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", "Contract add successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Adding contract failed",
                data: error.response?.data || {}
            });
        }
    },
    //  async addContract(req, res) {
    //         try {
    //             const errors = myValidationResult(req);
    //             if (!errors.isEmpty()) {
    //                 return res
    //                     .status(200)
    //                     .send(commonHelper.parseErrorRespose(errors.mapped()));
    //             }

    //             const data = JSON.parse(req.body.data);
    // zzz
    //             const files = req.files;
    //             const baseUrl = "https://blue-sky-tie-down-9dc714fbf6f8.herokuapp.com/public/files/";

    //             const updatedData = data.map((item, index) => ({
    //                 ...item,
    //                 logo: files[index]?`${baseUrl}${files[index].filename}` : null,
    //             }));
    //             let totalContracts = await contractServices.totalContracts();

    //             let addedContracts = [];

    //             for (let data of updatedData) {

    //                 const matchingRecords = totalContracts.filter(contract => contract.contractorEmail === data.contractorEmail);
    //                 let matchingData;

    //                 let postData = {
    //                     contractorName: data.contractorName,
    //                     logo: data.logo,
    //                     contractorPhone: data.contractorPhone,
    //                     contractorAddress: data.contractorAddress,
    //                     contractorCity: data.contractorCity,
    //                     contractorState: data.contractorState,
    //                     contractorZip: data.contractorZip,
    //                     contractorEmail: data.contractorEmail,
    //                     contacts: data.contacts,
    //                     ativities: data.ativities,
    //                     gaf: data.gaf,
    //                     gafCertifications: data.gafCertifications,
    //                     gafRating: data.gafRating,
    //                     gafReviews: data.gafReviews,
    //                     certineed: data.certineed,
    //                     certineedCertifications: data.certineedCertifications,
    //                     certineedRating: data.certineedRating,
    //                     certineedReviews: data.certineedReviews,
    //                     owensCoring: data.owensCoring,
    //                     owensCoringCertifications: data.owensCoringCertifications,
    //                     owensCoringRating: data.owensCoringRating,
    //                     owensCoringReviews: data.owensCoringReviews,
    //                     leadScore: data.leadScore,
    //                     leadSource: data.leadSource,
    //                     qualifiedContractorFormStarted: data.qualifiedContractorFormStarted,
    //                     qualifiedContractorFormSubmitted: data.qualifiedContractorFormSubmitted,
    //                     qualifiedContractorFormApproove: data.qualifiedContractorFormApproove,
    //                     notes: data.notes,
    //                     status: data.status,
    //                     internalNotes: data.internalNotes,
    //                     leadCompleteScore: data.leadCompleteScore,
    //                     regionalZipCode: data.regionalZipCode,
    //                     contractorRegion: data.contractorRegion,
    //                     contractStatus: false
    //                 };

    //                 if (matchingRecords.length > 0) {
    //                     matchingData = matchingRecords[0].id;
    //                     postData.refId = matchingData;
    //                     postData.duplicateRecord = true;
    //                 }

    //                 await contractServices.addContract(postData);
    //             }

    //             return res
    //                 .status(200)
    //                 .send(commonHelper.parseSuccessRespose(addedContracts, "Contracts added successfully"));
    //         } catch (error) {
    //             return res.status(400).json({
    //                 status: false,
    //                 message: error.response?.data?.error || error.message || "Adding contracts failed",
    //                 data: error.response?.data || {}
    //             });
    //         }
    //     },
    /*getAllContract*/
    async getAllContract(req, res) {
        try {
            let { page, length, status, startDate, endDate, region } = req.query;
            if (page <= 0 || length <= 0) {
                throw new Error("Page and length must be greater than 0");
            }

            if (req.query.qualifiedContractor !== undefined && req.query.qualifiedContractor != "true") {
                throw new Error("Invalid value for qualifiedContractor. Please send true.");
            }
            let qualified = req.query.qualifiedContractor;
            let contracts = await contractServices.getAllContract(page, length, qualified, status, startDate, endDate, region);
            if (!contracts) {
                throw new Error("Contracts not found");
            }
            contracts.forEach(element => {
                if (element.qualifiedContractorFormStarted) {
                    element.qualifiedContractorFormStarted = commonHelper.formatToCustomDate(element.qualifiedContractorFormStarted);
                }
                if (element.qualifiedContractorFormSubmitted) {
                    element.qualifiedContractorFormSubmitted = commonHelper.formatToCustomDate(element.qualifiedContractorFormSubmitted);
                }
                if (element.qualifiedContractorFormApproove) {
                    element.qualifiedContractorFormApproove = commonHelper.formatToCustomDate(element.qualifiedContractorFormApproove);
                }
                if (element.logo) {
                    element.logo = process.env.BASE_URL + element.logo;
                }
                if (element.dataValues.interactions.length > 0) {
                    const lastInteraction = element.dataValues.interactions[element.dataValues.interactions.length - 1];

                    if (lastInteraction?.dataValues?.date) {
                        lastInteraction.dataValues.date = commonHelper.formatToCustomDate(lastInteraction.dataValues.date);
                    }

                    lastInteraction.dataValues.totalInteractions = element.dataValues.interactions.length;
                    element.dataValues.interactions = [lastInteraction];
                }
            })
            let totalContracts = await contractServices.totalContracts(qualified);

            const contractsWithProposals = await Promise.all(
                contracts.map(async (contract) => {
                    const totalProposals = await db.generatedContractorsObj.count({
                        where: { contractor_id: contract.id }
                    });
                    return { ...contract.toJSON(), totalProposals };
                })
            );
            let response = {
                // totalProposals:contractsWithProposals,
                contracts: contractsWithProposals,
                totalRecords: totalContracts.length
            }
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(response, "All contracts displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Fetching contracts failed",
                data: error.response?.data || {}
            });
        }
    },
    /*updateContract*/
    async updateContract(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let contractId = req.query.contractId;

            let contract = await contractServices.getContract(contractId);
            if (!contract) {
                throw new Error("Contract not found");
            }
            const baseUrl = "/public/files/";
            const logo = req.file ? `${baseUrl}${req.file.filename}` : null;

            let data = req.body;
            if (data.qualifiedContractor !== undefined && data.qualifiedContractor !== "true") {
                throw new Error("Invalid value for qualifiedContractor. Please send true.");
            }
            let postData = {
                contractorName: data.contractorName,
                logo: logo,
                contractorPhone: data.contractorPhone,
                contractorAddress: data.contractorAddress,
                contractorCity: data.contractorCity,
                contractorState: data.contractorState,
                contractorZip: data.contractorZip,
                contractorEmail: data.contractorEmail,
                contacts: data.contacts,
                ativities: data.ativities,
                gaf: data.gaf,
                gafCertifications: data.gafCertifications,
                gafRating: data.gafRating,
                gafReviews: data.gafReviews,
                certineed: data.certineed,
                certineedCertifications: data.certineedCertifications,
                certineedRating: data.certineedRating,
                certineedReviews: data.certineedReviews,
                owensCoring: data.owensCoring,
                owensCoringCertifications: data.owensCoringCertifications,
                owensCoringRating: data.owensCoringRating,
                owensCoringReviews: data.owensCoringReviews,
                leadScore: data.leadScore,
                leadSource: data.leadSource,
                qualifiedContractorFormStarted: data.qualifiedContractorFormStarted,
                qualifiedContractorFormSubmitted: data.qualifiedContractorFormSubmitted,
                qualifiedContractorFormApproove: data.qualifiedContractorFormApproove,
                notes: data.notes,
                status: data.status,
                internalNotes: data.internalNotes,
                leadCompleteScore: data.leadCompleteScore,
                regionalZipCode: data.regionalZipCode,
                contractorRegion: data.contractorRegion,
                qualifiedContractors: data.qualifiedContractor
            }
            commonHelper.removeFalsyKeys(postData);
            let filteredActivityData = {
                contractorName: postData?.contractorName,
                contractorPhone: postData?.contractorPhone,
                contractorEmail: postData?.contractorEmail,
                gafCertifications: postData?.gafCertifications,
                certineedCertifications: postData?.certineedCertifications,
                owensCoringCertifications: postData?.owensCoringCertifications,
                leadScore: postData?.leadScore,
                status: postData?.status,
                contractorRegion: postData?.contractorRegion,
                notes: postData?.notes
            };
            commonHelper.removeFalsyKeys(filteredActivityData);

            /*addActivity*/
            let moduleName = "contractObj"
            let id = contractId;
            filteredActivityData = { ...filteredActivityData, moduleName, id }
            let changes = await commonHelper.compareChanges(filteredActivityData);
            if (changes.length != 0) {
                let newData = await commonHelper.transformChanges(changes, req.userId, contractId, moduleName)
                await leadServices.createActivity(newData);
            }

            let updateContract = await contractServices.updateContract(postData, contractId);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(updateContract, "Contract updated successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Updating contract failed",
                data: error.response?.data || {}
            });
        }
    },
    /*deleteContract*/
    async deleteContract(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let contractId = req.query.contractId;
            const contract = await contractServices.getContract(contractId);
            if (!contract) throw new Error("Contract not found");

            let deleteContract = await contractServices.deleteContract(contractId);
            let updateDuplicateData = {
                refId: null,
                duplicateRecord: null
            }
            await contractServices.updateDuplicateContract(updateDuplicateData, contractId);
            let data = {
                isDeleted: "deleted"
            }
            let module = "contractor"
            await notesServices.updateNotes(data, contractId, module);
            await activityServices.updateActivity(data, contractId, module);
            await contractServices.updateVerifiedDocument(data, contractId);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(deleteContract, "Contracts deleted successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Deleting contracts failed",
                data: error.response?.data || {}
            });
        }
    },
    /*getContractById*/
    async getContractById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let contractId = req.query.contractId;
            let contract = await contractServices.getContractById(contractId);
            if (!contract) throw new Error("Contract not found");

            if (contract.qualifiedContractorFormStarted) {
                contract.qualifiedContractorFormStarted = commonHelper.formatToCustomDate(contract?.qualifiedContractorFormStarted);
            }
            if (contract.qualifiedContractorFormSubmitted) {
                contract.qualifiedContractorFormSubmitted = commonHelper.formatToCustomDate(contract?.qualifiedContractorFormSubmitted);
            }
            if (contract.qualifiedContractorFormSubmitted) {
                contract.qualifiedContractorFormApproove = commonHelper.formatToCustomDate(contract?.qualifiedContractorFormApproove);
            }
            if (contract.logo) {
                contract.logo = process.env.BASE_URL + contract.logo;
            }
            if (contract.dataValues.interactions.length > 0) {
                const lastInteraction = contract.dataValues.interactions[contract.dataValues.interactions.length - 1];

                if (lastInteraction?.dataValues?.date) {
                    lastInteraction.dataValues.date = commonHelper.formatToCustomDate(lastInteraction.dataValues.date);
                }
                lastInteraction.dataValues.totalInteractions = contract.dataValues.interactions.length;
                contract.dataValues.interactions = [lastInteraction];
            }

            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(contract, "Contract fetched successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Contract fetching failed",
                data: error.response?.data || {}
            });
        }
    },
    /*bulkCreate*/
    async bulkContract(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }

            let data = req.body;
            if (!Array.isArray(data) || data.length === 0) {
                return res.status(400).json({
                    status: false,
                    message: "Invalid data format. Expected a non-empty array of contracts.",
                    data: {}
                });
            }
            await contractServices.addBulkContracts(data);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", `${data.length} contracts added successfully`));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Adding contracts failed",
                data: error.response?.data || {}
            });
        }
    },
    /*importCsv*/
    async importCsv(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ status: false, message: "No file uploaded" });
            }
            const file = req.files[0];

            const workbook = xlsx.readFile(file.path);
            const sheetName = workbook.SheetNames[0];
            const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

            if (!sheet || sheet.length < 2) {
                return res.status(400).json({ status: false, message: "No data found in file" });
            }

            const headers = sheet[0].map(header => header?.trim());

            const records = sheet.slice(1).map((row, rowIndex) => {
                if (!Array.isArray(row) || row.length === 0) {
                    return null;
                }

                return Object.fromEntries(
                    headers.map((key, index) => [key, row[index] !== undefined ? row[index] : null])
                );
            }).filter(Boolean);

            let totalContracts = await contractServices.totalContracts();
            const existingEmails = new Map(totalContracts.map(contract => [contract.contractorEmail, contract.id]));

            for (const record of records) {
                // Check if the contractorEmail exists in totalContracts
                const duplicateId = existingEmails.get(record.contractorEmail);

                // Add new properties to the record
                const newRecord = {
                    ...record,
                    refId: duplicateId || null,
                    duplicateRecord: !!duplicateId,
                };

                // Save the updated record
                await contractServices.addBulkContracts([newRecord]);
            }
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", `${records.length} contracts added successfully`));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Adding contracts failed",
                data: error.response?.data || {}
            });
        }
    },
    /*addContractRegion*/
    async addContractRegion(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let data = req.body;

            if (!Array.isArray(data.associateZipCode)) {
                return res.status(400).json({
                    status: false,
                    message: "associateZipCode must be an array",
                });
            }

            let postData = {
                regionName: data.regionName,
                associateZipCode: data.associateZipCode,
            }
            await contractServices.addContractRegion(postData);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", "ContractRegion added successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Adding contractRegion failed",
                data: error.response?.data || {}
            });
        }
    },
    /*getAllContractRegion*/
    async getAllContractRegion(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let getContractRegions = await contractServices.getContractRegions();
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(getContractRegions, "ContractRegion displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Fetching contractRegion failed",
                data: error.response?.data || {}
            });
        }
    },
    /*contractRegionById*/
    async contractRegionById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let regionId = req.query.regionId;
            let getContractRegion = await contractServices.contractRegionById(regionId);
            if (!getContractRegion) {
                throw new Error("Contract region not found");
            }
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(getContractRegion, "ContractRegion displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Fetching contractRegion failed",
                data: error.response?.data || {}
            });
        }
    },
    /*contractRegionUpdate*/
    async contractRegionUpdate(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let regionId = req.query.regionId;
            let getContractRegion = await contractServices.contractRegionById(regionId);
            if (!getContractRegion) {
                throw new Error("Contract region not found");
            }
            let data = req.body;
            if (data.associateZipCode !== undefined && !Array.isArray(data.associateZipCode)) {
                return res.status(400).json({
                    status: false,
                    message: "associateZipCode must be an array",
                });
            }
            let postData = {
                regionName: data.regionName,
                associateZipCode: data.associateZipCode,
            }
            commonHelper.removeFalsyKeys(postData);
            let contractRegionUpdate = await contractServices.contractRegionUpdate(postData, regionId);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(contractRegionUpdate, "ContractRegion updating successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Updating contractRegion failed",
                data: error.response?.data || {}
            });
        }
    },
    /*deleteContractRegion*/
    async deleteContractRegion(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let regionId = req.query.regionId;
            let getContractRegion = await contractServices.contractRegionById(regionId);
            if (!getContractRegion) {
                throw new Error("Contract region not found");
            }
            let deleteContractRegion = await contractServices.deleteContractRegion(regionId);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(deleteContractRegion, "ContractRegion deleted successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Deleting contractRegion failed",
                data: error.response?.data || {}
            });
        }
    },
    /*getRegionByZipCode*/
    async getRegionByZipCode(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let zipCode = req.query.zipCode;
            let getRegionByZipCode = await contractServices.getRegionByZipCode(zipCode);
            if (getRegionByZipCode.length == 0) {
                throw new Error("Region not found");
            }
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(getRegionByZipCode, "ContractRegion Dispalyed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "FEtching contractRegion failed",
                data: error.response?.data || {}
            });
        }
    },
    /*mergeContracts*/
    async mergeContracts(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            const contracts = req.body;

            if (!Array.isArray(contracts) || contracts.length === 0) {
                throw new Error("Invalid data format. Expecting an array of objects.");
            }

            let mergedResults = [];

            for (const contract of contracts) {
                let { parentContractId, childContractId, ...updatedData } = contract;
                if (!parentContractId || !childContractId) {
                    throw new Error("Both parentContractId and childContractId are required.");
                }

                let parentContract = await contractServices.parentContract(parentContractId);
                if (!parentContract) {
                    throw new Error(`Parent contract not found for ID: ${parentContractId}`);
                }

                let childContract = await contractServices.parentContract(childContractId);
                if (!childContract) {
                    throw new Error(`Child contract not found for ID: ${childContractId}`);
                }

                await contractServices.updateContract(updatedData, parentContractId);

                // Delete child contract
                await contractServices.deleteContract(childContractId);

                mergedResults.push({
                    parentContractId,
                    childContractId,
                    status: "Merged and deleted child contract"
                });
                /*addActivity*/
                let moduleName = "contractsObj"
                let addingObj = "mergeObj"
                postData = { moduleName, addingObj }
                let changes = await commonHelper.compareChanges(postData);
                let newData = await commonHelper.transformChanges(changes, req.userId, parentContractId, moduleName)
                await leadServices.createActivity(newData);
            }

            return res.status(200).send(commonHelper.parseSuccessRespose(mergedResults, "Contracts merged successfully"));

        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Merging contracts failed",
                data: error.response?.data || {}
            });
        }
    },
    /*addSubContractorVerification*/
    async addSubContractorVerification(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let contractorId = req.userId;
            let data = req.body;
            let contract = await contractServices.getContract(contractorId);
            if (!contract) {
                throw new Error("Contract not found");
            }
            const files = req.files;
            const fileData = [];
            const baseUrl = "/public/files/";

            Object.keys(files).forEach((key) => {
                files[key].forEach((file) => {
                    fileData.push({
                        fieldname: file.fieldname,
                        file: `${baseUrl}${file.filename}`,
                    });
                });
            });

            const fileUrls = {};
            if (fileData.length > 0) {
                fileData.forEach((file) => {
                    const docKey = file.fieldname;
                    if (docKey && file.file) {
                        fileUrls[docKey] = file.file;
                    }
                });
            }
            const postData = {
                contractorId: contractorId,
                doc1Name: data.doc1Name,
                doc2Name: data.doc2Name,
                doc3Name: data.doc3Name,
                doc4Name: data.doc4Name,
                doc5Name: data.doc5Name,
                doc6Name: data.doc6Name,
                doc7Name: data.doc7Name,
                doc8Name: data.doc8Name,
                doc9Name: data.doc9Name,
                doc10Name: data.doc10Name,
                doc11Name: data.doc11Name,
            };

            // Merging fileUrls into postData
            Object.assign(postData, fileUrls);
            let document = await contractServices.getDocumentByContractId(contractorId);
            if (document) {
                function getDocumentStatus(postData) {
                    const status = {};

                    Object.keys(postData).forEach(key => {
                        if (key.startsWith("doc") && key.endsWith("File") && postData[key]) {
                            const statusKey = key.replace("File", "Status");
                            status[statusKey] = "documentUploaded";
                        }
                    });

                    return status;
                }
                let status = getDocumentStatus(postData);
                let data = { ...postData, ...status }
                await contractServices.updateVerificationContract(data, contractorId);
            } else {
                await contractServices.addVerificationContract(postData);
            }
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", "Form is filled successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Adding verification contract failed",
                data: error.response?.data || {}
            });
        }
    },
    /*getContractorVerification*/
    async getContractorVerification(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let contactorId = req.query.contractId;
            let contract = await contractServices.getContract(contactorId);
            if (!contract) {
                throw new Error("Contract not found");
            }
            let contracts = await contractServices.getContractorVerification(contactorId);
            if (!contracts) {
                throw new Error("Document not found");
            }
            const { id, contractorId, ...docs } = contracts; // Extract common fields
            const baseUrl = "https://blue-sky-tie-down-9dc714fbf6f8.herokuapp.com";

            const transformedContracts = Object.entries(docs).reduce((acc, [key, value]) => {
                const match = key.match(/(doc\d+)(Name|File|Status|Note)/);
                if (match) {
                    const [, docNumber, docField] = match;
                    if (!acc[docNumber]) {
                        acc[docNumber] = { id, contractorId }; // Include `id` and `contractorId` in each object
                    }
                    acc[docNumber][docField.toLowerCase()] = value; // Convert field names to lowercase for consistency

                    acc[docNumber][docField.toLowerCase()] = docField === "File" ? `${baseUrl}${value}` : value;

                }
                return acc;
            }, {});

            const resultArray = Object.values(transformedContracts);

            const response = resultArray.map((doc, index) => ({
                ...doc,
                columnName: `doc${index + 1}`
            }));
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(response, "Document displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Fetching Document failed",
                data: error.response?.data || {}
            });
        }
    },
    /*getContractorVerification*/
    async getRejectContractorVerification(req, res) {
        try {
            let contactorId = req.userId;
            let contract = await contractServices.getContract(contactorId);
            if (!contract) {
                throw new Error("Contract not found");
            }
            let contracts = await contractServices.getContractorVerification(contactorId);
            if (!contracts) {
                throw new Error("Document not found");
            }
            const { id, contractorId, ...docs } = contracts;
            const baseUrl = process.env.BASE_URL;

            const transformedContracts = Object.entries(docs).reduce((acc, [key, value]) => {
                const match = key.match(/(doc\d+)(Name|File|Status|Note)/);
                if (match) {
                    const [, docNumber, docField] = match;
                    if (!acc[docNumber]) {
                        acc[docNumber] = { id, contractorId };
                    }
                    if (docField === "File" && value) {
                        acc[docNumber][`${docNumber}${docField}`] = `${baseUrl}${value}`;
                    } else {
                        acc[docNumber][`${docNumber}${docField}`] = value;
                    }
                }
                return acc;
            }, {});

            const resultArray = Object.values(transformedContracts);
            const rejectedRecords = resultArray.filter(doc => Object.values(doc).includes('rejected'));
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(resultArray, "All rejected displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Fetching contracts failed",
                data: error.response?.data || {}
            });
        }
    },
    /*updateContractorVerification*/
    async updateContractorVerification(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let { contactorId, verificationId, status, notes, columnName } = req.query;
            let document = await contractServices.getDocument(verificationId, contactorId);
            if (!document) {
                throw new Error("Document not found");
            }

            let statusColumn = columnName + "Status";
            let notesColumn = columnName + "Note";

            let documentId = document.id;
            let postData = {
                [statusColumn]: status,
                [notesColumn]: notes
            }
            /*addActivity*/
            let moduleName = "contractorVerificationObj"
            let id = verificationId;
            postData = { ...postData, moduleName, id }
            let changes = await commonHelper.compareChanges(postData);
            if (changes.length != 0) {
                moduleName = "contractObj"
                let newData = await commonHelper.transformChanges(changes, req.userId, contactorId, moduleName)
                await leadServices.createActivity(newData);
            }
            let updateDocument = await contractServices.updateDocument(postData, contactorId, documentId);
            let getDocument = await contractServices.getDocument(verificationId, contactorId);
            let keys = Object.entries(getDocument)
            const allApproved = keys
                .filter(([key]) => key.startsWith('doc') && key.endsWith('Status'))
                .every(([, value]) => value === 'approved');
            if (allApproved == true) {
                let status = {
                    qualifiedContractors: true
                }
                await contractServices.updateContract(status, contactorId);
                let contract = await contractServices.getContractById(contactorId);
                function generateRandomNumber() {
                    return Math.floor(100000 + Math.random() * 900000).toString();
                }

                let password = generateRandomNumber();
                function generateUsername(name) {
                    const parts = name.toLowerCase().split(" ");
                    const firstName = parts[0];
                    const lastName = parts[1] || "";
                    const randomNum = Math.floor(1000 + Math.random() * 9000);
                    return `${firstName}.${lastName}${randomNum}`;
                }

                let userName = generateUsername(contract.dataValues.contractorName);


                let postData = {
                    firstName: contract.dataValues.contractorName,
                    userName: userName,
                    email: contract.dataValues.contractorEmail,
                    password: bcrypt.hashSync(password, 8),
                    role: "qualified_contractor",
                    phoneNumber: contract.dataValues.contractorPhone
                }
                let credentials = {
                    email: postData.email,
                    password: password
                }
                await authServices.register(postData);
                await commonHelper.sendEmailToQualified(postData.email, credentials);
            }

            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(updateDocument, "Document updated successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Fetching contracts failed",
                data: error.response?.data || {}
            });
        }
    },
    /*getDocumentLink*/
    async getDocumentLink(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let contractId = req.query.contractId;
            let contract = await contractServices.getContract(contractId);
            if (!contract) {
                throw new Error("Contract not found");
            }
            let email = contract.contractorEmail;
            const payload = {
                id: contractId,
                email: email
            };
            const generateToken = () => {
                const secretKey = config.secret;
                const token = jwt.sign(
                    payload,
                    secretKey,
                    { expiresIn: "1d" }
                );
                return token;
            };
            const token = generateToken();
            let kycLink = "https://crm-rooftop.vercel.app/contractor-kyc" + "?" + "token=" + token
            let response = await commonHelper.sendEmail(email, kycLink);
            console.log('responseresponse', response)
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(response, "Kyc link send successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Adding verification contract failed",
                data: error.response?.data || {}
            });
        }
    },
    /*addLeadInteraction*/
    async addLeadInteraction(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let data = req.body;
            if (!data.contractId) {
                throw new Error("Contract Id is required");
            }
            let contract = await contractServices.getContract(data.contractId);
            if (!contract) {
                throw new Error("Contract not found");
            }
            let postData = {
                contractId: data.contractId,
                date: data.date,
                interactionType: data.interactionType,
                notes: data.notes
            }
            await contractServices.addLeadInteraction(postData);
            /*addActivity*/
            let moduleName = "contractObj"
            let addingObj = "leadInteractionObj"
            postData = { moduleName, addingObj }
            let changes = await commonHelper.compareChanges(postData);
            let newData = await commonHelper.transformChanges(changes, req.userId, data.contractId, moduleName)
            await leadServices.createActivity(newData);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", "Lead interaction added successfully successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Adding Lead interaction contract failed",
                data: error.response?.data || {}
            });
        }
    },
    /*getAllLeadInteraction*/
    async getAllLeadInteraction(req, res) {
        try {
            let { page, length } = req.query;
            if (page <= 0) {
                throw new Error("Page number must be greater than 0");
            }
            if (length <= 0) {
                throw new Error("Length number must be greater than 0");
            }
            let leadInteractions = await contractServices.getAllLeadInteraction(page, length);
            leadInteractions.forEach(element => {
                if (element.date) {
                    element.date = commonHelper.formatToCustomDate(element.date);
                }
            })
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(leadInteractions, "Lead interaction displayed successfully successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Fetching Lead interaction contract failed",
                data: error.response?.data || {}
            });
        }
    },
    /*getLeadInteractionByContractId*/
    async getLeadInteractionByContractId(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let contractId = req.query.contractId;
            let contract = await contractServices.getContractById(contractId);
            if (!contract) {
                throw new Error("Contract not found");
            }
            let interaction = await contractServices.getLeadInteractionByContractId(contractId);
            let totalInteractions;
            if (interaction.length > 0) {
                totalInteractions = interaction.length;
                interaction.forEach(element => {
                    element.dataValues.date = commonHelper.formatToCustomDate(element.dataValues.date);
                });
            }
            let response = { interaction, totalInteractions }
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(response, "Interaction fetched successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Contract fetching failed",
                data: error.response?.data || {}
            });
        }
    },
    /*getDuplicateContracts*/
    async getDuplicateContracts(req, res) {
        try {
            let duplicateContracts = await contractServices.getDuplicateContracts();
            const recordMap = new Map();

            duplicateContracts.forEach(contract => {
                const refId = contract.refId ? parseInt(contract.refId) : null;
                const contractId = contract.id;

                if (refId && refId !== contractId) {
                    // Ensure the original exists in the recordMap
                    if (!recordMap.has(refId)) {
                        const originalContract = duplicateContracts.find(c => c.id === refId) || null;
                        if (originalContract) {
                            recordMap.set(refId, { ...originalContract, duplicateRecords: [] });
                        }
                    }

                    // Add this contract as a duplicate under the original contract
                    if (recordMap.has(refId)) {
                        recordMap.get(refId).duplicateRecords.push(contract);
                    }
                }
            });

            let data = Array.from(recordMap.values());
            return res.status(200).send(
                commonHelper.parseSuccessRespose(data, "All duplicate contracts displayed successfully")
            );
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Fetching contracts failed",
                data: error.response?.data || {}
            });
        }
    },
    /*forgotPasswordRequested*/
    async forgotPasswordRequested(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            const { email } = req.body;
            const getUserInfo = await authServices.getSubContractorByEmail(email);
            if (!getUserInfo) {
                throw new Error("User not found");
            }
            const otp = commonHelper.generateOTP();
            let postData = {
                otp: otp
            }
            await authServices.updateSubContractor(postData, email);
            await commonHelper.sendMail(email, otp)

            return res.status(200).send(
                commonHelper.parseSuccessRespose("", "Email has been sent successfully to your email.")
            );
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Sending email failed",
                data: error.response?.data || {}
            });
        }
    },
    /*resetPassword*/
    async resetPassword(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            const { email, otp, newPassword } = req.body;
            const getUserInfo = await authServices.getSubContractorByEmail(email);
            if (!getUserInfo) {
                throw new Error("User not found");
            }
            let oldDate = getUserInfo.updatedAt;
            const currentDate = new Date();
            const timeDifference = currentDate - oldDate;

            if (timeDifference >= 10 * 60 * 1000) {
                throw new Error("OTP expired or invalid");
            }

            if (!getUserInfo.otp || getUserInfo.otp !== otp) {
                throw new Error("OTP expired or invalid");
            }
            let postData = {
                password: bcrypt.hashSync(newPassword, 8)
            }
            await authServices.updateSubContractor(postData, email);
            return res.status(200).send(
                commonHelper.parseSuccessRespose("", "Your password has been reset successfully.")
            );
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Reset password failed",
                data: error.response?.data || {}
            });
        }
    },

    async getGenerateContractor(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            const { contractorId, page, length } = req.query;
            const data = await contractServices.getGenerateContractor(contractorId, page, length);


            return res.status(200).send(
                commonHelper.parseSuccessRespose(data, "Generated Contractors fetched successfully")
            );
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Something went wrong",
                data: error.response?.data || {}
            });
        }
    },
    async getGenerateContractorById(req, res) {
        try {
            const { id } = req.query;

            if (!id) {
                return res.status(400).send({
                    status: false,
                    message: "ID is required",
                    data: {}
                });
            }

            const data = await contractServices.getGenerateContractorById(parseInt(id));

            if (!data) {
                return res.status(404).send({
                    status: false,
                    message: "Generated Contractor not found",
                    data: {}
                });
            }

            return res.status(200).send(
                commonHelper.parseSuccessRespose(data, "Generated Contractor fetched successfully")
            );
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.message || "Something went wrong",
                data: {}
            });
        }
    },

    async updateGenerateContractorStatus(req, res) {
        try {
            const { id, status } = req.body;

            if (!id || !status) {
                return res.status(400).send({
                    status: false,
                    message: "ID and status are required",
                    data: {}
                });
            }

            const data = await contractServices.updateGenerateContractorStatus(parseInt(id), status);

            if (!data) {
                return res.status(404).send({
                    status: false,
                    message: "Generated Contractor status not found",
                    data: {}
                });
            }

            return res.status(200).send(
                commonHelper.parseSuccessRespose(data, "Generated Contractor fetched successfully")
            );
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.message || "Something went wrong",
                data: {}
            });
        }
    },

    async updateCustomerSignature(req, res) {
        try {
            const customerId = req.query.id;
            

            if (!customerId) {
                return res.status(400).send({
                  status: false,
                  message: "customerId ID is required",
                  data: {}
                });
              }

              if (!req.file) {
                return res.status(400).send({
                  status: false,
                  message: "No file uploaded",
                  data: {}
                });
              }
            const filePath = `files/${req.file.filename}`;
            const data = await contractServices.updateCustomerSignature(customerId,filePath);
 
            if (!data) {
                return res.status(404).send({
                    status: true,
                    message: "Add customer signature",
                    data: {}
                });
            }

            return res.status(200).send(
                commonHelper.parseSuccessRespose(data, "customer signature ADD successfully")
            );
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.message || "Something went wrong",
                data: {}
            });
        }
    },
    async updateContractNotes(req, res) {
        try {
          const contractId = req.query.id;
          const { notes } = req.body;
          const userId = req.userId;
      
          if (!contractId) {
            return res.status(400).send({
              status: false,
              message: "Contract ID is required",
              data: {}
            });
          }
      
          if (!notes) {
            return res.status(400).send({
              status: false,
              message: "Notes are required",
              data: {}
            });
          }
      
          const data = await contractServices.updateContractNotes(contractId, notes,userId);
          
          if (!data) {
            return res.status(404).send({
              status: false,
              message: "Contract not found",
              data: {}
            });
          }
      
          return res
            .status(200)
            .send(commonHelper.parseSuccessRespose(data, "Contract notes updated successfully"));
        } catch (error) {
          return res.status(400).json({
            status: false,
            message: error.message || "Something went wrong",
            data: {}
          });
        }
      },
    validate(method) {
        switch (method) {
            case "addContract": {
                return [
                    check("contractorName").not().isEmpty().withMessage("Contract Name is Required"),
                    check("contractorPhone").not().isEmpty().withMessage("Contract Phone is Required"),
                    check("contractorAddress").not().isEmpty().withMessage("Contract Address is Required"),
                    check("contractorEmail").not().isEmpty().withMessage("Contract Email is Required")
                ];
            }
            case "updateContract": {
                return [
                    check("contractId").not().isEmpty().withMessage("Contract Id is Required"),
                ];
            }
            case "addContractRegion": {
                return [
                    check("regionName").not().isEmpty().withMessage("RegionName is Required"),
                    check("associateZipCode").not().isEmpty().withMessage("AssociateZipCode is Required"),
                ];
            }
            case "contractRegionById": {
                return [
                    check("regionId").not().isEmpty().withMessage("Region Id is Required"),
                ];
            }
            case "getRegionByZipCode": {
                return [
                    check("zipCode").not().isEmpty().withMessage("Zip code is Required"),
                ];
            }
            case "mergeContracts": {
                return [
                    check("parentContractId").not().isEmpty().withMessage("Parent ContractId is Required"),
                    check("childContractId").not().isEmpty().withMessage("Child ContractId is Required")
                ];
            }
            case "updateContractorVerification": {
                return [
                    check("verificationId").not().isEmpty().withMessage("VerificationId is Required"),
                    check("contactorId").not().isEmpty().withMessage("ContractId is Required")
                ];
            }
            case "getLeadInteractionByContractId": {
                return [
                    check("contractId").not().isEmpty().withMessage("ContractId is Required"),
                ];
            }
            case "resetPassword": {
                return [
                    check("email").not().isEmpty().withMessage("Email is Required"),
                    check("otp").not().isEmpty().withMessage("Otp is Required"),
                    check("password").not().isEmpty().withMessage("Password is Required"),
                ];
            }
            case "forgotPasswordRequested": {
                return [
                    check("email").not().isEmpty().withMessage("Email is Required")
                ];
            }
        }
    }
}


