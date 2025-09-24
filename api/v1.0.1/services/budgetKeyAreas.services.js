var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op } = require("sequelize");

module.exports = {
  /*addBudgetKeyAreas*/
  async addBudgetKeyAreas(postData) {
    try {
      return await db.budgetKeyAreasObj.create(postData);
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*getAllBudgetKeyAreas*/
  async getAllBudgetKeyAreas({ page, limit, search }) {
    try {
      const offset = (page - 1) * limit;

      const whereCondition = {};

      if (search) {
        whereCondition[Op.or] = [{ name: { [Op.iLike]: `%${search}%` } }];
      }

      const { rows, count } = await db.budgetKeyAreasObj.findAndCountAll({
        where: whereCondition,
        order: [["id", "ASC"]],
        limit,
        offset,
      });

      return {
        total: count,
        page,
        limit,
        data: rows,
      };
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*getBudgetKeyAreasById*/
  async getBudgetKeyAreasById(id) {
    try {
      const leadTeams = await db.budgetKeyAreasObj.findOne({
        where: { id },
      });

      if (!leadTeams) {
        throw new Error("Budget key areas not found");
      }

      return leadTeams;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*deleteBudgetKeyAreas*/
  async deleteBudgetKeyAreas(id) {
    try {
      const leadTeams = await db.budgetKeyAreasObj.findOne({ where: { id } });
      if (!leadTeams) {
        throw new Error("Budget key areas not found");
      }

      // Soft delete
      await leadTeams.destroy();

      return true;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*updateBudgetKeyAreas*/
  async updateBudgetKeyAreas(id, postData) {
    try {
      const leadTeams = await db.budgetKeyAreasObj.findOne({
        where: { id: parseInt(id) },
      });
      if (!leadTeams) throw new Error("Budget key areas not found");

      const updated = await leadTeams.update(postData);
      return updated;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
