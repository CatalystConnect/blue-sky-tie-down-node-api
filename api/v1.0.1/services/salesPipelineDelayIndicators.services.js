var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op, Sequelize } = require("sequelize");

module.exports = {
  /*addPipelineDelayIndicator*/
  async addPipelineDelayIndicator(postData) {
    try {
      let pipelines = await db.salesPipelinesDelayIndicatorsObj.create(postData);
      return pipelines;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
