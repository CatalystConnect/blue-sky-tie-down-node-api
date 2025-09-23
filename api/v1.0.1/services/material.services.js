var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");

module.exports = {
    /*addMaterial*/
    async addMaterial(postData) {
        try {
            let user = await db.materialObj.create(postData);
            return user;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getMaterialList*/
    async getMaterialList(page, length) {
        try {
            limit = length || 10;
            offset = (page - 1) * limit || 0;
            let user = await db.materialObj.findAll({
                limit,
                offset,
                order: [["id", "DESC"]],
                include: [
                    {
                        model: db.materialQuotesObj,
                        as: "materialQuotes",
                        attributes: { exclude: ["createdAt", "updatedAt"] },
                        required: false
                    },
                    {
                        model: db.additionalQuotesObj,
                        as: "additionalQuotes",
                        attributes: { exclude: ["createdAt", "updatedAt"] },
                        required: false
                    },
                ]
            });
            return user;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getMaterialList*/
    async totalRecords() {
        try {
            let user = await db.materialObj.findAll();
            return user;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
     /*getMaterialById*/
     async getMaterialById(materialId) {
        try {
            let material = await db.materialObj.findOne({
                where: {id: materialId},
                include: [
                    {
                        model: db.materialQuotesObj,
                        as: "materialQuotes",
                        attributes: { exclude: ["createdAt", "updatedAt"] },
                        required: false
                    }
                ]
            });
            return material;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*updateMaterial*/
    async updateMaterial(data, materialId) {
        try {
            let material = await db.materialObj.update(data, {
                where: {id: materialId}
            });
            return material;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*deleteMaterial*/
    async deleteMaterial(materialId) {
        try {
            let material = await db.materialObj.destroy({
                where: {id: materialId}
            });
            return material;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*addMaterialQuote*/
    async addMaterialQuote(postData) {
        try {
            let user = await db.materialQuotesObj.bulkCreate(postData);
            return user;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
     /*addAdditionalQuote*/
     async addAdditionalQuote(postData) {
        try {
            let user = await db.additionalQuotesObj.bulkCreate(postData);
            return user;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
     /*getMaterialQuotesByMaterialId*/
     async getMaterialQuotesByMaterialId(materialId) {
        try {
            let material = await db.materialQuotesObj.findAll({
                where: {materialId: materialId},
                raw: true
            });
            return material;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*updateMaterialQuote*/
    async updateMaterialQuote(data) {
        try {
            const updatePromises = data.map(async (record) => {
                return await db.materialQuotesObj.update(record, {
                    where: { id: record.id },
                });
            });
    
            const results = await Promise.all(updatePromises);
            return results;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getAdditionalQuotesByMaterialId*/
    async getAdditionalQuotesByMaterialId(materialId) {
        try {
            let material = await db.additionalQuotesObj.findAll({
                where: {materialId: materialId},
                raw: true
            });
            return material;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
     /*updateAdditionalQuote*/
     async updateAdditionalQuote(data) {
        try {
            const updatePromises = data.map(async (record) => {
                return await db.additionalQuotesObj.update(record, {
                    where: { id: record.id },
                });
            });
    
            const results = await Promise.all(updatePromises);
            return results;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*addToken*/
    async addToken(data) {
        try {
            const results = await db.jwtTokenObj.create(data);
            return results;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*checkTokenExist*/
    async checkTokenExist(token) {
        try {
            const results = await db.jwtTokenObj.findOne({
                where: {token: token},
                raw: true
            });
            return results;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getLeadBycustomerEmail*/
    async getLeadBycustomerEmail(customerEmail) {
        try {
            const results = await db.leadsObj.findOne({
                where: {email: customerEmail},
                raw: true
            });
            return results;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    
};
