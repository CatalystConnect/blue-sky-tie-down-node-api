var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");

module.exports = {
    /*addProductAttribute*/
    async addProductCategory(postData) {
        try {
            let category = await db.productCategoryObj.create(postData);
            return category;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getAllProductAttributes*/
    async getAllProductCategory(page, length) {
        try {
            limit = length ;
            offset = (page - 1) * limit || 0;
            let category = await db.productCategoryObj.findAll({
            limit,
            offset,
            order: [["id", "DESC"]],
            });
            return category;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getTotalProductcategory*/
    async getTotalProductcategory() {
        try {
            let category = await db.productCategoryObj.findAll();
            return category;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*categoryExist*/
    async categoryExist(category) {
        try {
            let parentCategory = await db.productCategoryObj.findOne({
                where: {name: category}
            });
            return parentCategory;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*updateProductCategoryById*/
    async updateProductCategoryById(data, productCategoryId) {
        try {
            let category = await db.productCategoryObj.update(data, {
                where: {id: productCategoryId}
            });
            return category;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
     /*deleteProductCategoryById*/
     async deleteProductCategoryById(productCategoryId) {
        try {
            let category = await db.productCategoryObj.destroy({
                where: {id: productCategoryId}
            });
            return category;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getProductCategoryById*/
    async getProductCategoryById(categoryId) {
        try {
            let parentCategory = await db.productCategoryAssociationObj.findAll({
                where: {categoryId: categoryId},
                raw: true
            });
            return parentCategory;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
     /*getAllCategoryWithProduct*/
     async getAllCategoryWithProduct() {
        try {
            let category = await db.productCategoryObj.findAll({
                attributes: ["id","name","goodProduct","betterProduct","bestProduct"],
                order: [["id", "ASC"]],
                include: [
                    {
                      model: db.productCategoryAssociationObj,
                      as: "product",
                      attribute: [],
                      required: false,
                      include: [
                        {
                          model: db.catalogObj,
                          as: "productDetails",
                          attributes: ["id","productName","type"],
                          required: false,
                          include: [
                            {
                              model: db.catalogVariationsObj,
                              as: "variation",
                              required: false
                            }
                          ]
                        },
                        
                      ]
                    }
                ]
            });
            return category;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*productExist*/
    async productExist(productId) {
        try {
            let productExist = await db.catalogVariationsObj.findOne({
                where: {id: productId}
            });
            return productExist;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
      /*getProduct*/
      async getProduct(productId) {
        try {
            let getProduct = await db.catalogObj.findAll({
                where: {id: productId},
            });
            return getProduct;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
     /*getProductCategoryById*/
     async categoryById(categoryId) {
        try {
            let categoryById = await db.productCategoryObj.findOne({
                where: {id: categoryId},
                raw: true
            });
            return categoryById;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
     /*getVariations*/
     async getVariations(productId) {
        try {
            let getProduct = await db.catalogObj.findAll({
                where: {id: productId},
                raw: true,
                include: [
                    {
                        model: db.catalogVariationsObj,
                        as: "variations",
                        attributes: { exclude: ["createdAt", "updatedAt"] },
                        required: false
                    }
                ]
            });
            return getProduct;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
     /*allCategory*/
     async allCategory() {
        try {
            let category = await db.productCategoryObj.findAll({
            order: [["id", "DESC"]],
            attributes: ["id", "name"] 
            });
            return category;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    
}