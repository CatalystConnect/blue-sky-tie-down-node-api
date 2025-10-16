var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op } = require("sequelize");

module.exports = {
  /*addState*/
  async addState(postData) {
    try {
      let addState = await db.stateObj.create(postData);
      return addState;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*getAllState*/
  async getAllState({ page, per_page, search }) {
    try {
       const limit = per_page
      const offset = (page - 1) * limit;

      const whereCondition = {};

      if (search) {
        whereCondition[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
         
        ];
      }

      const { rows, count } = await db.stateObj.findAndCountAll({
        where: whereCondition,
        order: [["id", "DESC"]],
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

  /*getStateById*/
  async getStateById(id) {
    try {
      const stateById = await db.stateObj.findOne({
        where: { id },
      });

      if (!stateById) {
        throw new Error("stateById not found");
      }

      return stateById;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*deleteState*/
  async deleteState(id) {
    try {
      const state = await db.stateObj.findOne({ where: { id } });
      if (!state) {
        throw new Error("state   not found");
      }

      // Soft delete
      await state.destroy();

      return true;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*updateState*/
  async updateState(id, postData) {
    try {
      const state = await db.stateObj.findOne({
        where: { id: parseInt(id) },
      });
      if (!state) throw new Error("state not found");

      const updated = await state.update(postData);
      return updated;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
