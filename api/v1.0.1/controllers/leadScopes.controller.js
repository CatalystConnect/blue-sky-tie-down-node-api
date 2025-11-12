require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator"); // Updated import
const leadScopesServices = require("../services/leadScopes.services");
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});

module.exports = {
  /*addLeadScopes*/
  async addLeadScopes(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      let postData = {
        name: req.body.name,
        user_id: req.userId,
      };

      const leadScope = await leadScopesServices.addLeadScopes(postData);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            leadScope,
            "Lead scope added successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Lead scope creation failed",
        data: error.response?.data || {},
      });
    }
  },

  async findAllLeadScopes(req, res) {
    try {
      const leadScopes = await leadScopesServices.findAllLeadScopes(req.query);
      res.status(200).json({
        status: true,
        message: "Lead scopes fetched successfully",
        data: leadScopes.data,
        meta: leadScopes.meta,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Failed to fetch leadScopes",
        error: err.message,
      });
    }
  },

  async getLeadScopesById(req, res) {
    try {
      const leadScopeId = req.query.id;
      const leadScope = await leadScopesServices.getLeadScopesById(leadScopeId);

      if (!leadScope) {
        return res.status(404).json({
          status: false,
          message: "Lead scope not found",
        });
      }

      res.status(200).json({
        status: true,
        message: "Lead scope fetched successfully",
        data: leadScope,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Failed to fetch leadScope",
        error: err.message,
      });
    }
  },

  async updateLeadScopes(req, res) {
    try {
      const leadScopeId = req.query.id;
      const updatedData = req.body;

      const leadScope = await leadScopesServices.updateLeadScopes(
        leadScopeId,
        updatedData
      );

      if (!leadScope) {
        return res.status(404).json({
          status: false,
          message: "Lead scope not found",
        });
      }

      res.status(200).json({
        status: true,
        message: "Lead scope updated successfully",
        data: leadScope,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Failed to update leadScope",
        error: err.message,
      });
    }
  },

  async deleteLeadScopes(req, res) {
    try {
      const leadScopeId = req.query.id;

      const deleted = await leadScopesServices.deleteLeadScopes(leadScopeId);

      if (!deleted) {
        return res.status(404).json({
          status: false,
          message: "Lead scope not found",
        });
      }

      res.status(200).json({
        status: true,
        message: "Lead scope deleted successfully",
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Failed to delete leadScope",
        error: err.message,
      });
    }
  },

  validate(method) {
    switch (method) {
      case "addLeadScopes": {
        return [
          check("name")
            .notEmpty()
            .withMessage("Name is required")
            .custom(async (value) => {
              const existing = await leadScopesServices.getLeadScopesByName(
                value
              );
              if (existing) {
                throw new Error("Lead scope name already exists");
              }
              return true;
            }),
        ];
      }

      case "updateLeadScopes": {
        return [
          check("name")
            .notEmpty()
            .withMessage("Name is required")
            .custom(async (value, { req }) => {
              const existing = await leadScopesServices.getLeadScopesByName(
                value
              );
              if (existing && existing.id !== parseInt(req.params.id)) {
                throw new Error("Lead scope name already exists");
              }

              return true;
            }),
        ];
      }
    }
  },
};
