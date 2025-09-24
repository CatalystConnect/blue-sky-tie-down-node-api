require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator");
const budgetKeyAreasServices = require("../services/budgetKeyAreas.services");
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});

module.exports = {
  /* addBudgetKeyAreas */
  async addBudgetKeyAreas(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const data = req.body;

      const postData = {
        name: data.name,
        ordering: data.order,
        status: data.status || "active",
      };

      await budgetKeyAreasServices.addBudgetKeyAreas(postData);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            {},
            "Budget key areas added successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Add budget key areas failed",
        data: {},
      });
    }
  },

  /*getAllBudgetKeyAreas*/
  async getAllBudgetKeyAreas(req, res) {
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

      const result = await budgetKeyAreasServices.getAllBudgetKeyAreas({
        page,
        limit,
        search,
      });

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            result,
            "Budget key areas fetched successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Get budget key areas failed",
        data: error.response?.data || {},
      });
    }
  },

  /*getBudgetKeyAreasById*/
  async getBudgetKeyAreasById(req, res) {
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

      const result = await budgetKeyAreasServices.getBudgetKeyAreasById(id);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            result,
            "Budget key areas fetched successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Get budget key areas failed",
        data: error.response?.data || {},
      });
    }
  },

  /*deleteBudgetKeyAreas*/
  async deleteBudgetKeyAreas(req, res) {
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

      await budgetKeyAreasServices.deleteBudgetKeyAreas(id);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            "",
            "Budget key areas deleted successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Delete budget key areas failed",
        data: error.response?.data || {},
      });
    }
  },

  /*updateBudgetKeyAreas*/
  async updateBudgetKeyAreas(req, res) {
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

      const postData = {
        name: data.name,
        ordering: data.order,
        status: data.status || "active",
      };
      const result = await budgetKeyAreasServices.updateBudgetKeyAreas(
        id,
        postData
      );

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            result,
            "Budget key areas updated successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Update budget key areas failed",
        data: error.response?.data || {},
      });
    }
  },
};
