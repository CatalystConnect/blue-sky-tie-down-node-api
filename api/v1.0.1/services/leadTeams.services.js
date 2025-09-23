var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op } = require("sequelize");

module.exports = {
  /*addLeadTeams*/
  async addLeadTeams(postData) {
    try {
      let leadTeams = await db.leadTeamsObj.create(postData);
      return leadTeams;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*getAllLeadTeams*/
  async getAllLeadTeams({ page, limit, search }) {
    try {
      const offset = (page - 1) * limit;

      const whereCondition = {};

      if (search) {
        whereCondition[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
        ];
      }

      const { rows, count } = await db.leadTeamsObj.findAndCountAll({
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

  /*getLeadTeamsById*/
  async getLeadTeamsById(id) {
    try {
      const leadTeams = await db.leadTeamsObj.findOne({
        where: { id },
      });

      if (!leadTeams) {
        throw new Error("Lead team not found");
      }

      return leadTeams;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*deleteLeadTeams*/
  async deleteLeadTeams(id) {
    try {
      const leadTeams = await db.leadTeamsObj.findOne({ where: { id } });
      if (!leadTeams) {
        throw new Error("Lead team not found");
      }

      // Soft delete
      await leadTeams.destroy();

      return true;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*updateLeadTeams*/
  async updateLeadTeams(id, postData) {
    try {
      const leadTeams = await db.leadTeamsObj.findOne({
        where: { id: parseInt(id) },
      });
      if (!leadTeams) throw new Error("Lead team not found");

      const updated = await leadTeams.update(postData);
      return updated;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
