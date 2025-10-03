require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator");
const budgetCategoryServices = require("../services/budgetCategory.services");
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});

module.exports = {
  /* addBudgetCategory */
  async addBudgetCategory(req, res) {
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

      await budgetCategoryServices.add(postData);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            {},
            "Budget category added successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Add budget category failed",
        data: {},
      });
    }
  },

  /*getAllBudgetCategories*/
  async getAllBudgetCategories(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      let { page = 1, per_page = 10, search = "" } = req.query;
      page = parseInt(page);
      per_page = parseInt(per_page);

      const result = await budgetCategoryServices.getAll({
        page,
        per_page,
        search,
      });

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            result,
            "Budget categories fetched successfully"
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

  /*getBudgetCategoryById*/
  async getBudgetCategoryById(req, res) {
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

      const result = await budgetCategoryServices.getById(id);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            result,
            "Budget category fetched successfully"
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

  /*deleteBudgetCategory*/
  async deleteBudgetCategory(req, res) {
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

      await budgetCategoryServices.delete(id);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            "",
            "Budget category deleted successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Delete budget category failed",
        data: error.response?.data || {},
      });
    }
  },

  /*updateBudgetCategory*/
  async updateBudgetCategory(req, res) {
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
      const result = await budgetCategoryServices.update(
        id,
        postData
      );

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            result,
            "Budget category updated successfully"
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
