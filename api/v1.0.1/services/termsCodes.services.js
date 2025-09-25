var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op } = require("sequelize");

module.exports = {
  /*addTerms*/
  async addTerms(postData) {
    try {
      return await db.teamsCodesObj.create(postData);
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*getAllTerms*/
  async getAllTerms({ page = 1, limit = 10, search = "" }) {
    try {
      const offset = (page - 1) * limit;

      const result = await db.teamsCodesObj.findAndCountAll({
        where: search
          ? {
              name: { [db.Sequelize.Op.iLike]: `%${search}%` }, // adjust field
            }
          : {},
        offset,
        limit,
        order: [["id", "DESC"]],
      });

      return result; // { rows: [...], count: totalRecords }
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*getTermsById*/
  async getTermsById(id) {
    try {
      const leadTerms = await db.teamsCodesObj.findOne({
        where: { id },
      });

      if (!leadTerms) {
        throw new Error("Terms code not found");
      }

      return leadTerms;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*deleteTerms*/
  async deleteTerms(id) {
    try {
      const leadTerms = await db.teamsCodesObj.findOne({ where: { id } });
      if (!leadTerms) {
        throw new Error("Terms code not found");
      }

      // Soft delete
      await leadTerms.destroy();

      return true;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*updateTerms*/
  async updateTerms(id, postData) {
    try {
      const leadTerms = await db.teamsCodesObj.findOne({
        where: { id: parseInt(id) },
      });
      if (!leadTerms) throw new Error("Terms code not found");

      const updated = await leadTerms.update(postData);
      return updated;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
