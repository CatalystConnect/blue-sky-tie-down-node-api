var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op } = require("sequelize");

module.exports = {
  /*addBudgetCategory*/
  async add(postData) {
    try {
      return await db.budgetScopeObj.create(postData);
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*getAllBudgetCategories*/
  async getAll({ page, limit, search }) {
    try {
      const offset = (page - 1) * limit;

      const whereCondition = {};
      if (search) {
        whereCondition[Op.or] = [{ name: { [Op.iLike]: `%${search}%` } }];
      }

      const { rows, count } = await db.budgetScopeObj.findAndCountAll({
        where: whereCondition,
        include: [
          {
            model: db.budgetCategoryObj,
            as: "budgetCategory",
          },
        ],
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

  /*getBudgetKeyAreasById*/
  async getById(id) {
    try {
      const category = await db.budgetScopeObj.findOne({
        where: { id },
        include: [
          {
            model: db.scopeCategoryObj,
            as: "categories",
            order: [["order_index", "ASC"]],
            include: [
              {
                model: db.scopeGroupObj,
                as: "groups",
                include: [
                  {
                    model: db.scopeSegmentObj,
                    as: "segments"
                  }
                ]
              }
            ]
          }
        ]
      });

      if (!category) {
        throw new Error("Budget scope not found");
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
      const category = await db.budgetScopeObj.findOne({ where: { id } });
      if (!category) {
        throw new Error("Budget scope not found");
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
      const category = await db.budgetScopeObj.findOne({
        where: { id: parseInt(id) },
      });
      if (!category) throw new Error("Budget scope not found");

      const updated = await category.update(postData);
      return updated;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
