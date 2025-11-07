require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator");
const interactionsServices = require("../services/interactions.services");
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});

module.exports = {
  /*addInteractions*/
  async addInteractions(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let data = req.body;

      let postData = {
        user_id: req.userId,
        lead_id: data.lead_id || null,
        interaction_type_id: data.interaction_type_id || null,
        contact_id: data.contact_id || null,
        notes: data.notes || null,
        dcs: data.dcs || null,
        date: data.date || null,
      };
      await interactionsServices.addInteractions(postData);
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose("", "add interaction successfully")
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "add interaction failed",
        data: error.response?.data || {},
      });
    }
  },
  // controllers/interactions.controller.js
  async getAllinteractionByLeadId(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      // ✅ Read leadId from query string
      const leadId = req.query.leadId;

      if (!leadId) {
        return res.status(400).json({
          status: false,
          message: "leadId query parameter is required",
          data: {},
        });
      }

      // ✅ Fetch from service
      const interactions = await interactionsServices.getAllinteractionByLeadId(
        leadId
      );

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            interactions,
            "Interactions fetched successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Get Interaction failed",
        data: error.response?.data || {},
      });
    }
  },
};
