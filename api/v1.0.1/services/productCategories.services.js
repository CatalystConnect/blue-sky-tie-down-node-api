var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op } = require("sequelize");

module.exports = {
     /*addProductCategories*/
     async addProductCategories(postData) {
        try {
            let unit = await db.productCategoriesObj.create(postData);
            return unit;
        }  catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
          }
    },
    /*getAllProductCategories*/
    async getAllProductCategories({ page, per_page, search }) {
        try {
          const limit = parseInt(per_page);
          const offset = (page - 1) * limit;
      
          let whereCondition = {};
          if (search) {
            whereCondition = {
              name: { [Op.like]: `%${search}%` },
            };
          }
      
          const { rows, count } = await db.productCategoriesObj.findAndCountAll({
            where: whereCondition,
            limit,
            offset,
            order: [["created_at", "DESC"]],
          });
      
          return {
            total: count,
            page: parseInt(page),
            per_page: limit,
            totalPages: Math.ceil(count / limit),
            productCategories: rows,
          };
        } catch (e) {
          logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
          throw e;
        }
      },
      
     /*getProductCategoriesById*/
     async getProductCategoriesById(productCategoriesId) {
        try {
            let productCategories = await db.productCategoriesObj.findOne({
                where: {id: productCategoriesId}
            });
            return productCategories;
        }  catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
          }
    },
      /*deleteProductCategories*/
      async deleteProductCategories(productCategoriesId) {
        try {
            let deleteProductCategories = await db.productCategoriesObj.destroy({
                where: {id: productCategoriesId}
            });
            return deleteProductCategories;
        }  catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
          }
    },
     /*updateProductCategories*/
     async updateProductCategories(data, productCategoriesId) {
        try {
            let productCategories = await db.productCategoriesObj.update(data, {
                where: {id: productCategoriesId}
            });
            return productCategories;
        }  catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
          }
    },
}