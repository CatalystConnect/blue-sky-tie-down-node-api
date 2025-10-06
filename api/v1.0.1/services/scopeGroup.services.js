var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op } = require("sequelize");

module.exports = {

  async add(postData) {
    try {
      return await db.scopeGroupObj.create(postData);
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  async getAll({ page, limit, search }) {
    try {
      const offset = (page - 1) * limit;

      const whereCondition = {};
      if (search) {
        whereCondition[Op.or] = [{ name: { [Op.iLike]: `%${search}%` } }];
      }

      const { rows, count } = await db.scopeGroupObj.findAndCountAll({
        where: whereCondition,
        order: [["id", "DESC"]], // order by 'ordering' column
        limit,
        offset,
      });

      // Pagination metadata
      const lastPage = Math.ceil(count / limit);
      const from = count > 0 ? offset + 1 : 0;
      const to = offset + rows.length;

      return {
        data: rows,
        meta: {
          current_page: page,
          from: from,
          to: to,
          per_page: limit,
          last_page: lastPage,
          total: count,
        },
      };
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  async getById(id) {
    try {
      const category = await db.scopeGroupObj.findOne({
        where: { id },
      });

      if (!category) {
        throw new Error("Scope group not found");
      }

      return category;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  async delete(id) {
    try {
      const category = await db.scopeGroupObj.findOne({ where: { id } });
      if (!category) {
        throw new Error("Scope group not found");
      }

      // Soft delete
      await category.destroy();

      return true;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  async update(id, postData) {
    try {
      const category = await db.scopeGroupObj.findOne({
        where: { id: parseInt(id) },
      });
      if (!category) throw new Error("Scope group not found");

      const updated = await category.update(postData);
      return updated;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  async findByCategoryId(categoryId) {
    try {
      const groups = await db.scopeGroupObj.findAll({
        where: { scope_category_id: categoryId }, 
      });
      return groups; 
    } catch (error) {
      console.error("Error in findByCategoryId:", error);
      throw error; 
    }
  },
};
