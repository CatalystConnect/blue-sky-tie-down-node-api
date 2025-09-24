var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op } = require("sequelize");

module.exports = {
  /*addTeams*/
  async addTeams(postData) {
    try {
      return await db.teamsCodesObj.create(postData); 
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*getAllTeams*/
  async getAllTeams({ page, limit, search }) {
    try {
      const offset = (page - 1) * limit;

      const whereCondition = {};

      if (search) {
        whereCondition[Op.or] = [{ name: { [Op.iLike]: `%${search}%` } }];
      }

      const { rows, count } = await db.teamsCodesObj.findAndCountAll({
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

  /*getTeamsById*/
  async getTeamsById(id) {
    try {
      const leadTeams = await db.teamsCodesObj.findOne({
        where: { id },
      });

      if (!leadTeams) {
        throw new Error("Terms code not found");
      }

      return leadTeams;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*deleteTeams*/
  async deleteTeams(id) {
    try {
      const leadTeams = await db.teamsCodesObj.findOne({ where: { id } });
      if (!leadTeams) {
        throw new Error("Terms code not found");
      }

      // Soft delete
      await leadTeams.destroy();

      return true;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*updateTeams*/
  async updateTeams(id, postData) {
    try {
      const leadTeams = await db.teamsCodesObj.findOne({
        where: { id: parseInt(id) },
      });
      if (!leadTeams) throw new Error("Terms code not found");

      const updated = await leadTeams.update(postData);
      return updated;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
