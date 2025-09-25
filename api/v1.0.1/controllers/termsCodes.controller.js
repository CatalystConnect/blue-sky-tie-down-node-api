require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator");
const termsCodesServices = require("../services/termsCodes.services");
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});

module.exports = {
  /* Add Terms Code */
  async addTerms(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const data = req.body;

      const postData = {
        code: data.code,
        term_type: data.term_type,
        description: data.description,
        days_due: data.days_due,
        due_type: data.due_type,
        discount_days: data.discount_days,
        discount_percent: data.discount_percent,
        is_cod: data.is_cod === true || data.is_cod === "true" ? 1 : 0,
        is_prepay: data.is_prepay === true || data.is_prepay === "true" ? 1 : 0,
        active: data.active === true || data.active === "true" ? 1 : 0,
      };

      await termsCodesServices.addTerms(postData);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose({}, "Terms code added successfully")
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Add terms code failed",
        data: {},
      });
    }
  },

  /*getAllTerms*/
  // async getAllTerms(req, res) {
  //   try {
  //     const errors = myValidationResult(req);
  //     if (!errors.isEmpty()) {
  //       return res
  //         .status(200)
  //         .send(commonHelper.parseErrorRespose(errors.mapped()));
  //     }

  //     let { page = 1, limit = 10, search = "" } = req.query;
  //     page = parseInt(page);
  //     limit = parseInt(limit);

  //     const result = await termsCodesServices.getAllTerms({
  //       page,
  //       limit,
  //       search,
  //     });

  //     return res
  //       .status(200)
  //       .send(
  //         commonHelper.parseSuccessRespose(
  //           result,
  //           "Terms code fetched successfully"
  //         )
  //       );
  //   } catch (error) {
  //     return res.status(400).json({
  //       status: false,
  //       message:
  //         error.response?.data?.error ||
  //         error.message ||
  //         "Get Terms code failed",
  //       data: error.response?.data || {},
  //     });
  //   }
  // },
  async getAllTerms(req, res) {
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

      const result = await termsCodesServices.getAllTerms({
        page,
        limit,
        search,
      });

      const response = {
        data: result.rows, // array of records
        meta: {
          current_page: page,
          per_page: limit,
          total: result.count,
          last_page: Math.ceil(result.count / limit),
          from: result.count > 0 ? (page - 1) * limit + 1 : 0,
          to: Math.min(page * limit, result.count),
        },
      };

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            response,
            "Terms code fetched successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Get Terms code failed",
        data: error.response?.data || {},
      });
    }
  },

  /*getTermsById*/
  async getTermsById(req, res) {
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

      const result = await termsCodesServices.getTermsById(id);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            result,
            "Terms code fetched successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Get terms code failed",
        data: error.response?.data || {},
      });
    }
  },

  /*deleteTerms*/
  async deleteTerms(req, res) {
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

      await termsCodesServices.deleteTerms(id);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            "",
            "Terms code deleted successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Delete terms code failed",
        data: error.response?.data || {},
      });
    }
  },

  /*updateTerms*/
  async updateTerms(req, res) {
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
        code: data.code,
        term_type: data.term_type,
        description: data.description,
        days_due: data.days_due,
        due_type: data.due_type,
        discount_days: data.discount_days,
        discount_percent: data.discount_percent,
        is_cod: data.is_cod === true || data.is_cod === "true" ? 1 : 0,
        is_prepay: data.is_prepay === true || data.is_prepay === "true" ? 1 : 0,
        active: data.active === true || data.active === "true" ? 1 : 0,
      };

      const result = await termsCodesServices.updateTerms(id, postData);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            result,
            "Terms code updated successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Update terms code failed",
        data: error.response?.data || {},
      });
    }
  },
};
