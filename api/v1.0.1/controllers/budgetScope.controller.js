require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator");

const budgetScopeServices = require("../services/budgetScope.services");

const scopeCategoryServices = require("../services/scopeCategory.services");
const scopeGroupServices = require("../services/scopeGroup.services");
const scopeSegmentServices = require("../services/scopeSegment.services");

const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});

module.exports = {
  /* addBudgetScope */
  async addBudgetScope(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      const data = req.body;
      const postData = {
        title: data.title,
        short_title: data.short_title,
        status: data.status || "active",
        category: data.category,
        user_id: req.userId, 
      };
      const scopeObj = await budgetScopeServices.add(postData);
      const scopeId = scopeObj.id;
      let scopeCategories = JSON.parse(data.categories);

      for (let i = 0; i < scopeCategories.length; i++) {
        const category = scopeCategories[i];
        const catPostData = {
          user_id : req.userId,
          scope_id : scopeId,
          title : category.title
        }
        const categoryObj = await scopeCategoryServices.add(catPostData);
        const categoryId = categoryObj.id;

        for (let j = 0; j < category.groups.length; j++) {
          const group = category.groups[j];
          const groupPostData = {
            user_id : req.userId,
            scope_category_id : categoryId,
            title : group.title
          }
          const groupObj = await scopeGroupServices.add(groupPostData);
          const groupId = groupObj.id;

          for (let k = 0; k < group.segments.length; k++) {
            const segment = group.segments[k];
            const segmentPostData = {
              user_id : req.userId,
              scope_group_id : groupId,
              title : segment.title,
              url : segment.url,
              options : JSON.stringify(segment.option)
            }
            const segmentObj = await scopeSegmentServices.add(segmentPostData);
            const segmentId = segmentObj.id;
          }
        }
      }

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            {scopeId},
            "Budget scope added successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Add budget scope failed",
        data: {},
      });
    }
  },

  /*getAllBudgetScopes*/
  async getAllBudgetScopes(req, res) {
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

      const result = await budgetScopeServices.getAll({
        page,
        limit,
        search,
      });

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            result,
            "Budget scopes fetched successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Get budget scope failed",
        data: error.response?.data || {},
      });
    }
  },

  /*getBudgetScopeById*/
  async getBudgetScopeById(req, res) {
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

      const result = await budgetScopeServices.getById(id);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            result,
            "Budget scope fetched successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Get budget scope failed",
        data: error.response?.data || {},
      });
    }
  },

  /*deleteBudgetScope*/
  async deleteBudgetScope(req, res) {
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

      await budgetScopeServices.delete(id);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            "",
            "Budget scope deleted successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Delete budget scope failed",
        data: error.response?.data || {},
      });
    }
  },

  /*updateBudgetScope*/
  async updateBudgetScope(req, res) {
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
        title: data.title,
        short_title: data.short_title,
        status: data.status || "active",
        category: data.category,
        user_id: req.userId, 
      };

      const result = await budgetScopeServices.update(
        id,
        postData
      );

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            result,
            "Budget scope updated successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Update budget scope failed",
        data: error.response?.data || {},
      });
    }
  },
};
