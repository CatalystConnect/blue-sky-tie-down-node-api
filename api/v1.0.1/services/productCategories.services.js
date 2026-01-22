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
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*getAllProductCategories*/
  // async getAllProductCategories({ page, per_page, search }) {
  //     try {
  //       const limit = parseInt(per_page);
  //       const offset = (page - 1) * limit;

  //       let whereCondition = {};
  //       if (search) {
  //         whereCondition = {
  //           name: { [Op.like]: `%${search}%` },
  //         };
  //       }

  //       const { rows, count } = await db.productCategoriesObj.findAndCountAll({
  //         where: whereCondition,
  //         limit,
  //         offset,
  //         order: [["created_at", "DESC"]],
  //       });

  //       return {
  //         total: count,
  //         page: parseInt(page),
  //         per_page: limit,
  //         totalPages: Math.ceil(count / limit),
  //         productCategories: rows,
  //       };
  //     } catch (e) {
  //       logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //       throw e;
  //     }
  //   },
  //       async getAllProductCategories({ page, per_page, search }) {
  //   try {

  //     let whereCondition = {};
  //     if (search) {
  //       whereCondition = {
  //         name: { [Op.like]: `%${search}%` },
  //       };
  //     }

  //     // CASE 1 → no pagination → return all categories
  //     if (!page || !per_page) {
  //       const rows = await db.productCategoriesObj.findAll({
  //         where: whereCondition,
  //         order: [["created_at", "DESC"]],
  //       });

  //       return {
  //         total: rows.length,
  //         page: null,
  //         per_page: null,
  //         totalPages: 1,
  //         productCategories: rows
  //       };
  //     }

  //     // CASE 2 → pagination
  //     const limit = parseInt(per_page);
  //     const offset = (page - 1) * limit;

  //     const { rows, count } = await db.productCategoriesObj.findAndCountAll({
  //       where: whereCondition,
  //       limit,
  //       offset,
  //       order: [["created_at", "DESC"]],
  //     });

  //     return {
  //       total: count,
  //       page: parseInt(page),
  //       per_page: limit,
  //       totalPages: Math.ceil(count / limit),
  //       productCategories: rows,
  //     };

  //   } catch (e) {
  //     throw e;
  //   }
  // },
  async getAllProductCategories({ page, per_page, search }) {
    try {
      let whereCondition = {};

      if (search) {
        whereCondition = {
          name: { [Op.like]: `%${search}%` },
        };
      }

      // ---------- CASE 1: no pagination (same logic) ----------
      if (!page || !per_page) {
        const rows = await db.productCategoriesObj.findAll({
          where: whereCondition,
          order: [["created_at", "DESC"]],
        });

        const total = rows.length;

        return {
          data: rows,
          meta: {
            page: 1,
            limit: null,
            current_count: total,
            loaded_till_now: total,
            remaining: 0,
            total,
            has_more: false
          }
        };
      }

      // ---------- CASE 2: pagination (same logic) ----------
      page = Math.max(parseInt(page) || 1, 1);
      const limit = Math.max(parseInt(per_page) || 10, 1);
      const offset = (page - 1) * limit;

      const { rows, count } = await db.productCategoriesObj.findAndCountAll({
        where: whereCondition,
        limit,
        offset,
        order: [["created_at", "DESC"]],
      });

      // ---------- LAZY LOAD META ----------
      const total = count;
      const current_count = rows.length;
      const loaded_till_now = offset + current_count;
      const remaining = Math.max(total - loaded_till_now, 0);
      const has_more = loaded_till_now < total;

      return {
        data: rows,
        meta: {
          page,
          limit,
          current_count,
          loaded_till_now,
          remaining,
          total,
          has_more
        }
      };

    } catch (e) {
      throw e;
    }
  },
  /*getProductCategoriesById*/
  async getProductCategoriesById(productCategoriesId) {
    try {
      let productCategories = await db.productCategoriesObj.findOne({
        where: { id: productCategoriesId }
      });
      return productCategories;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*deleteProductCategories*/
  async deleteProductCategories(productCategoriesId) {
    try {
      let deleteProductCategories = await db.productCategoriesObj.destroy({
        where: { id: productCategoriesId }
      });
      return deleteProductCategories;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*updateProductCategories*/
  async updateProductCategories(data, productCategoriesId) {
    try {
      let productCategories = await db.productCategoriesObj.update(data, {
        where: { id: productCategoriesId }
      });
      return productCategories;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
}