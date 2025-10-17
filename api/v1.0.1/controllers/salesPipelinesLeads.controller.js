require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const salesPipelinesServices = require("../services/salesPipelines.services");


module.exports = {
  async salesPipelinesLeads(req, res) {
    try {
      const pipelineId = req.query.pipeline_id; 
      const leads = await salesPipelinesServices.getSalesPipelinesLeads(pipelineId);

      return res.status(200).json({
        success: true,
        data: leads,
      });
    } catch (error) {
      console.error("Error fetching pipeline leads:", error);
      return res.status(500).json({
        success: false,
        message: "Server error while fetching sales pipeline leads",
      });
    }
  },
};
