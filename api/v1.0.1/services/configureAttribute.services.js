var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");

module.exports = {
    /*addConfigureAttribute*/
    async addConfigureAttribute(postData) {
        try {
            let user = await db.configureAttributeObj.create(postData);
            return user;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getAllConfigAttributes*/
    async getAllConfigAttributes(page, length, attributeId) {
        try {
            limit = length || 10;
            offset = (page - 1) * limit || 0;
            let attribute = await db.configureAttributeObj.findAll({
            where: {attributeId: attributeId},
            limit,
            offset,
            order: [["id", "DESC"]],
            });
            return attribute;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getTotalAttributes*/
    async getTotalConfigAttributes(attributeId) {
        try {
            let attribute = await db.configureAttributeObj.findAll({
                where: {attributeId: attributeId}
            });
            return attribute;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getConfigAttributesById*/
    async getConfigAttributesById(configAttributeId) {
        try {
            let attribute = await db.configureAttributeObj.findOne({
                where: {id: configAttributeId}
            });
            return attribute;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*updateConfigAttributesById*/
    async updateConfigAttributesById(data, attributeId) {
        try {
            let attribute = await db.configureAttributeObj.update(data, {
                where: {id: attributeId}
            });
            return attribute;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
     /*deleteConfigAttribute*/
     async deleteConfigAttribute(attributeId) {
        try {
            let attribute = await db.configureAttributeObj.destroy({
                where: {id: attributeId}
            });
            return attribute;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    }
}