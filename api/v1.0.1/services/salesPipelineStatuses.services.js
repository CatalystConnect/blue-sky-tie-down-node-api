var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op, Sequelize } = require("sequelize");

module.exports = {
  /*addSalesPipelineStatus*/
  async addSalesPipelineStatus(postData) {
    try {
      let pipelines = await db.salesPipelinesStatusesObj.create(postData);
      return pipelines;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  async getSalesPipelinesStatusById(pipelineId) {
    try {
      const pipelineStatus = await db.salesPipelinesStatusesObj.findOne({
        where: { id: pipelineId },
        include: [
          { model: db.salesPipelinesStatusesObj, as: "salesPipelinesStatuses" },
        ],
      });

      return pipelineStatus;
    } catch (err) {
      console.error("getSalesPipelinesStatusById  Error:", err);
      throw err;
    }
  },

  async getDefaultPipelineStatusByType(pipelineType) {
    try {
      const defaultStatus = await db.salesPipelinesStatusesObj.findOne({
        where: {
          sales_pipeline_id: pipelineType,
          is_default:  "true",
        },
      });

      return defaultStatus;
    } catch (err) {
      console.error("getDefaultPipelineStatusByType Error:", err);
      throw err;
    }
  }

};
