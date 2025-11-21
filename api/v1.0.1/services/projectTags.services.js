var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op } = require("sequelize");

module.exports = {
  /*addProductTags*/
  async addProductTags(postData) {
    try {
      let addProductTags = await db.projectTagsObj.create(postData);
      return addProductTags;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*getAllProductTags*/
  async getAllProductTags({ page, per_page, search, id }) {
    try {
      const limit = per_page
      const offset = (page - 1) * limit;

      const whereCondition = {};

      if (search) {
        whereCondition[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },

        ];
      }
      if (id) {
        try {
          if (id.startsWith("[")) {
            const idsArray = JSON.parse(id);
            whereCondition.id = { [Op.in]: idsArray };
          } else {
            whereCondition.id = parseInt(id);
          }
        } catch (err) {
          console.log("Invalid id format", err);
        }
      }

      const { rows, count } = await db.projectTagsObj.findAndCountAll({
        where: whereCondition,
        order: [["order", "ASC"]],
        limit,
        offset,
      });

      return {
        data: rows,
        meta: {
          total: count,
          page,
          per_page,
          // hasPrevPage: page > 1
        }
      }
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*getProductTagsById*/
  async getProductTagsById(id) {
    try {
      const projectTypes = await db.projectTagsObj.findOne({
        where: { id },
      });

      if (!projectTypes) {
        throw new Error("Product Tags not found");
      }

      return projectTypes;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*deleteProductTags*/
  async deleteProductTags(id) {
    try {
      const ProductTags = await db.projectTagsObj.findOne({ where: { id } });
      if (!ProductTags) {
        throw new Error("project Tags  not found");
      }

      // Soft delete
      await ProductTags.destroy();

      return true;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*updateProductTags*/
  async updateProductTags(id, postData) {
    try {
      const projectTags = await db.projectTagsObj.findOne({
        where: { id: parseInt(id) },
      });
      if (!projectTags) throw new Error("project Tags not found");

      const updated = await projectTags.update(postData);
      return updated;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
