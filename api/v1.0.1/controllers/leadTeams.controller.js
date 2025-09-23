require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator");
const leadTeamsServices = require("../services/leadTeams.services");
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});

module.exports = {
  /*addLeadTeams*/
  async addLeadTeams(req, res) {
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
        name: data.name,
        contact_id: data.contact_id,
      };
      await leadTeamsServices.addLeadTeams(postData);
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose("", "Add lead team successfully")
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Add lead team failed",
        data: error.response?.data || {},
      });
    }
  },

  /*getAllLeadTeams*/
  async getAllLeadTeams(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      let { page = 1, limit = 10, search = "" } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);

      const result = await leadTeamsServices.getAllLeadTeams({
        page,
        limit,
        search,
      });

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            result,
            "Lead team fetched successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Get lead team failed",
        data: error.response?.data || {},
      });
    }
  },

  /*getLeadTeamsById*/
  async getLeadTeamsById(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const { id } = req.query;
      if (!id) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose({ id: "ID is required" }));
      }

      const result = await leadTeamsServices.getLeadTeamsById(id);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            result,
            "Lead team fetched successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Get lead team failed",
        data: error.response?.data || {},
      });
    }
  },

  /*deleteLeadTeams*/
  async deleteLeadTeams(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const { id } = req.query;
      if (!id) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose({ id: "ID is required" }));
      }

      await leadTeamsServices.deleteLeadTeams(id);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose("", "Lead team deleted successfully")
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Delete lead team failed",
        data: error.response?.data || {},
      });
    }
  },

  /*updateLeadTeams*/
  async updateLeadTeams(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const { id } = req.query;
      if (!id) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose({ id: "ID is required" }));
      }

      const data = req.body;

      let postData = {
        user_id: req.userId,
        name: data.name,
        contact_id: data.contact_id,
      };

      const result = await leadTeamsServices.updateLeadTeams(id, postData);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            result,
            "Lead team updated successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Update lead team failed",
        data: error.response?.data || {},
      });
    }
  },
};
