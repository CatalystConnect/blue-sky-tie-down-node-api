var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op } = require("sequelize");

module.exports = {
  /*addBudgetCategory*/
  async add(postData) {
    try {
      return await db.budgetCategoryObj.create(postData);
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*getAllBudgetCategories*/
  async getAll({ page, per_page, search }) {
    try {
      const offset = (page - 1) * per_page;

      const whereCondition = {};
      if (search) {
        whereCondition[Op.or] = [{ name: { [Op.iLike]: `%${search}%` } }];
      }

      const { rows, count } = await db.budgetCategoryObj.findAndCountAll({
        where: whereCondition,
        order: [["ordering", "ASC"]], // order by 'ordering' column
        per_page,
        offset,
      });

      // Pagination metadata
      const lastPage = Math.ceil(count / per_page);
      const from = count > 0 ? offset + 1 : 0;
      const to = offset + rows.length;

      return {
        data: rows,
        meta: {
          current_page: page,
          from: from,
          to: to,
          per_page: per_page,
          last_page: lastPage,
          total: count,
        },
      };
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*getBudgetKeyAreasById*/
  async getById(id) {
    try {
      const category = await db.budgetCategoryObj.findOne({
        where: { id },
      });

      if (!category) {
        throw new Error("Budget category not found");
      }

      return category;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*deleteBudgetKeyAreas*/
  async delete(id) {
    try {
      const category = await db.budgetCategoryObj.findOne({ where: { id } });
      if (!category) {
        throw new Error("Budget category not found");
      }

      // Soft delete
      await category.destroy();

      return true;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*updateBudgetKeyAreas*/
  async update(id, postData) {
    try {
      const category = await db.budgetCategoryObj.findOne({
        where: { id: parseInt(id) },
      });
      if (!category) throw new Error("Budget category not found");

      const updated = await category.update(postData);
      return updated;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
