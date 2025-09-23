var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");

module.exports = {
    /*addProductAttribute*/
    async addProductAttribute(postData) {
        try {
            let attribute = await db.productAttributeObj.create(postData);
            return attribute;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getAllProductAttributes*/
    async getAllProductAttributes(page, length) {
        try {
            limit = length || 10;
            offset = (page - 1) * limit || 0;
            let attribute = await db.productAttributeObj.findAll({
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
    /*getTotalProductAttributes*/
    async getTotalProductAttributes() {
        try {
            let attribute = await db.productAttributeObj.findAll();
            return attribute;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getProductAttributesById*/
    async getProductAttributesById(attributeId) {
        try {
            let attribute = await db.productAttributeObj.findOne({
                where: {id: attributeId}
            });
            return attribute;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*updateProductAttributesById*/
    async updateProductAttributesById(data, attributeId) {
        try {
            let attribute = await db.productAttributeObj.update(data, {
                where: {id: attributeId}
            });
            return attribute;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
     /*deleteProductAttributesById*/
     async deleteProductAttributesById(attributeId) {
        try {
            let attribute = await db.productAttributeObj.destroy({
                where: {id: attributeId}
            });
            return attribute;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getProduct*/
    async getProduct(productId) {
        try {
            let attribute = await db.catalogObj.findOne({
                where: {id: productId}
            });
            return attribute;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
     /*getAttributesByProductId*/
     async getAttributesByProductId(productId) {
        try {
            let attribute = await db.productAttributeObj.findAll({
                where: {productId: productId},
                raw: true
            });
            return attribute;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    }
}