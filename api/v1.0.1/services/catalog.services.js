var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op } = require("sequelize");
module.exports = {
    /*addCatalog*/
    async addCatalog(postData) {
        try {
            let catalog = await db.catalogObj.create(postData);
            return catalog;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getAllCatalog*/
    async getAllCatalog(page, length,) {
        try {
            limit = length;
            offset = (page - 1) * limit || 0;
            let catalog = await db.catalogObj.findAll({
                offset,
                limit,
                order: [["id", "DESC"]],
                include: [
                    {
                        model: db.catalogVariationsObj,
                        as: "variations",
                        attributes: { exclude: ["createdAt", "updatedAt"] },
                        required: false
                    },
                    {
                        model: db.productAttributeObj,
                        as: "productAttributes",
                        attributes: { exclude: ["createdAt", "updatedAt"] },
                        required: false
                    },
                ]
            });
            return catalog;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getCatalogById*/
    async getCatalogById(catalogId) {
        try {
            let catalog = await db.catalogObj.findOne({
                where: {id: catalogId},
                include: [
                    {
                        model: db.catalogVariationsObj,
                        as: "variations",
                        attributes: { exclude: ["createdAt", "updatedAt"] },
                        required: false
                    },
                    {
                        model: db.catalogAttributeObj,
                        as: "attributes",
                        attributes: { exclude: ["createdAt", "updatedAt"] },
                        required: false
                    },
                ]
            });
            return catalog;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*updateCatalogById*/
    async updateCatalogById(data, catalogId) {
        try {
            let catalog = await db.catalogObj.update(data, {
                where: {id: catalogId}
            });
            return catalog;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
     /*deleteCatalogById*/
     async deleteCatalogById(catalogId) {
        try {
            let catalog = await db.catalogObj.destroy({
                where: {id: catalogId}
            });
            return catalog;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*addVariations*/
    async addVariations(postData) {
        try {
            let catalog = await db.catalogVariationsObj.bulkCreate(postData);
            return catalog;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
     /*updateVariations*/
     async updateVariations(data, catalogId) {
        try {
            let [catalog] = await db.catalogVariationsObj.update(data, {
                where: {catalogId: catalogId}
            });
            return catalog;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*totalCatalog*/
    async totalCatalog() {
        try {
            let catalog = await db.catalogObj.findAll();
            return catalog;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
      /*getVariationsByCatalogId*/
      async getVariationsByCatalogId(catalogId) {
        try {
            let catalog = await db.catalogVariationsObj.findAll({
                where: {catalogId: catalogId}
            });
            return catalog;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*deleteVariations*/
    async deleteVariations(variationId) {
        try {
            let catalog = await db.catalogVariationsObj.destroy({
                where: {id: variationId}
            });
            return catalog;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*addAssociayion*/
    async addAssociayion(postData) {
        try {
            let catalog = await db.productCategoryAssociationObj.create(postData);
            return catalog;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*deleteAssociayion*/
    async deleteAssociayion(catalogId) {
        try {
            let catalog = await db.productCategoryAssociationObj.destroy({
                where: { productId: catalogId}
            });
            return catalog;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getCategory*/
    async getCategory(catalogId) {
        try {
            let catalog = await db.productCategoryAssociationObj.findOne({
                where: { productId: catalogId},
                raw: true,
                attributes : ["categoryId"]
            });
            return catalog;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    //  /*getCategoryValues*/
    //  async getCategoryValues(catalogId) {
    //     try {
    //         const categoryIds = catalogId.map(cat => cat.categoryId);
    //         let catalog = await db.productCategoryObj.findAll({
    //             where: {  id: {
    //                 [Op.in]: categoryIds
    //               }},
    //             raw: true,
    //             attributes : ["name"]
    //         });
    //         return catalog;
    //     } catch (e) {
    //         logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
    //         throw e;
    //     }
    // },
     /*getCatalog*/
     async getCatalog(catalogId) {
        try {
            let catalog = await db.catalogVariationsObj.findAll({
                where: {catalogId: catalogId},
                raw: true
            });
            return catalog;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
     /*updateVariation*/
     async updateVariation(cleanedVariationRecords) {
        try {
            const updatePromises = cleanedVariationRecords.map(async (record) => {
                const id = record.id;
                delete record.id;
                return await db.catalogVariationsObj.update(record,
                    { where: { id } }
                  )
            });
    
            const results = await Promise.all(updatePromises);
            return results;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*addAttribute*/
    async addAttribute(postData) {
        try {
            let catalog = await db.catalogAttributeObj.create(postData);
            return catalog;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
     /*updateAttribute*/
     async updateAttribute(postData, catalogId) {
        try {
            let catalog = await db.catalogAttributeObj.update(postData,{
                where: {catalogId: catalogId}
            });
            return catalog;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
      /*deleteAssociationByCatalogId*/
      async deleteAssociationByCatalogId(catalogId) {
        try {
            let catalog = await db.productCategoryAssociationObj.destroy({
                where: {productId: catalogId}
            });
            return catalog;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getCatalogById*/
    async getCatalogInVariation(catalogId) {
        try {
            let catalog = await db.catalogVariationsObj.findAll({
                where: {catalogId: catalogId},
                raw: true
            });
            return catalog;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
     /*deleteVariation*/
     async deleteVariation(variationId) {
        try {
            let catalog = await db.catalogVariationsObj.destroy({
                where: {id: variationId},
                raw: true
            });
            return catalog;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
     /*deleteProductFromBetter*/
     async deleteProductFromBetter(catalogId) {
        try {
            let records = await db.productCategoryObj.findAll({
                where: {
                    [Op.or]: [
                        { goodProduct: catalogId },
                        { betterProduct: catalogId },
                        { bestProduct: catalogId }
                    ]
                },
                raw: true
            });
            const matches = records.map((record) => {
                const result = {};
                if (record.goodProduct == catalogId) result.goodProduct = null;
                if (record.betterProduct == catalogId) result.betterProduct = null;
                if (record.bestProduct == catalogId) result.bestProduct = null;
                return result;
            });
    
            return matches;        
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
     /*updateProductCategoryById*/
     async updateProductCategoryById(data, catalogId) {
        try {
            let category = await db.productCategoryObj.update(data, {
                where: {
                    [Op.or]: [
                        { goodProduct: catalogId },
                        { betterProduct: catalogId },
                        { bestProduct: catalogId }
                    ]
                }
            });
            return category;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
};
