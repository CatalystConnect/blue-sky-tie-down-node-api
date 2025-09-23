var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");

module.exports = {
    /*addAttribute*/
    async addAttribute(postData) {
        try {
            let user = await db.attributeObj.create(postData);
            return user;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getAllAttributes*/
    async getAllAttributes(page, length) {
        try {
            limit = length || 10;
            offset = (page - 1) * limit || 0;
            let attribute = await db.attributeObj.findAll({
            limit,
            offset,
            order: [["id", "DESC"]],
            include: [
                {
                    model: db.configureAttributeObj,
                    as: "configAttributes",
                    attributes: ["name"],
                    required: false
                }
            ]
            });
            return attribute;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getTotalAttributes*/
    async getTotalAttributes() {
        try {
            let attribute = await db.attributeObj.findAll();
            return attribute;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getAttributesById*/
    async getAttributesById(attributeId) {
        try {
            let attribute = await db.attributeObj.findOne({
                where: {id: attributeId},
                include: [
                    {
                        model: db.configureAttributeObj,
                        as: "configAttributes",
                        attributes: ["name"],
                        required: false
                    }
                ]
            });
            return attribute;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*updateAttributesById*/
    async updateAttributesById(data, attributeId) {
        try {
            let attribute = await db.attributeObj.update(data, {
                where: {id: attributeId}
            });
            return attribute;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
     /*deleteAttribute*/
     async deleteAttribute(attributeId) {
        try {
            let attribute = await db.attributeObj.destroy({
                where: {id: attributeId}
            });
            return attribute;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    }
}