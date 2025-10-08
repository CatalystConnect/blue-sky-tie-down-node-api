var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op, Sequelize } = require("sequelize");

module.exports = {
  async addSubmittal(postData) {
    try {
      return await db.submittalsObj.create(postData);
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  async getAllSubmittals() {
    try {
      return await db.submittalsObj.findAll({ order: [["id", "DESC"]] });
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  async getSubmittalById(id) {
    try {
      return await db.submittalsObj.findOne({ where: { id } });
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  async updateSubmittal(id, data) {
    try {
      const submittal = await db.submittalsObj.findOne({ where: { id } });
      if (!submittal) return null;

      await submittal.update(data);
      return submittal;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  async deleteSubmittal(id) {
    try {
      const submittal = await db.submittalsObj.findOne({ where: { id } });
      if (!submittal) return null;

      await submittal.destroy();
      return true;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
