var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op, fn, col, where } = require("sequelize");

module.exports = {
  /*getAllLeads*/
  async getAllLeads(
    page,
    length,
    search,
    date,
    role_id,
    userId,
    role,
    take_all
  ) {
    try {
      const limit = length || 10;
      const offset = (page - 1) * limit || 0;

      let whereCondition = {};

      let queryOptions = {
        where: whereCondition,
        order: [["id", "DESC"]],
        distinct: true,
        include: [
          {
            model: db.userObj,
            as: "salesPersons",
            attributes: { exclude: ["password"] },
          },
        ],
      };

      if (!(take_all && take_all === "all")) {
        queryOptions.limit = limit;
        queryOptions.offset = offset;
      }

      let { rows: leads, count } = await db.leadsObj.findAndCountAll(
        queryOptions
      );

      return { leads, count };
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*addLead*/
  async addLead(postData) {
    try {
      let lead = await db.leadsObj.create(postData);
      return lead;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*getLeadById*/
  async getLeadById(leadId) {
    try {
      const lead = await db.leadsObj.findOne({
        where: { id: leadId },
      });
      return lead;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*leadUpdate*/
  async leadUpdate(data, leadId) {
    try {
      const lead = await db.leadsObj.update(data, {
        where: { id: leadId },
      });
      return lead;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*leadDelete*/
  async leadDelete(leadId) {
    try {
      let leads = await db.leadsObj.destroy({
        where: { id: leadId },
      });
      return leads;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
