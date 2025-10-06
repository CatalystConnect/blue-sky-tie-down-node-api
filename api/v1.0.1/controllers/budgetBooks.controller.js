require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator"); // Updated import
const budgetBooksServices = require("../services/budgetBooks.services");
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});

module.exports = {
  /*addBudgetBooks*/
  async addBudgetBooks(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      let data = req.body;

      if (typeof data.form === "string") {
        try {
          data = JSON.parse(data.form);
        } catch (err) {
          return res
            .status(400)
            .json({ status: false, message: "Invalid JSON in form data." });
        }
      }

      const postData = {
        name: data.name || null,
        user_id : req.userId,
        engineer_id: data.engineer_id || null,
        budget_book_id: data.budget_book_id || null,
        customer_id: data.customer_id || null,
        contact_id: data.contact_id || null,
        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
        quote_date: data.quote_date || null,
        plan_date: data.plan_date || null,
        plan_status: data.plan_status || null,
        plan_info: data.plan_info || null,
        plan_note: data.plan_note || null,
        terms: data.terms || null,
        tax: data.tax || null,
        job_no: data.job_no || null,
        up_margin: data.up_margin || null,
        sp_margin: data.sp_margin || null,
        mc_margin: data.mc_margin || null,
        sw_margin: data.sw_margin || null,
        total_adders: data.total_adders || null,
        total_calculate: data.total_calculate || null,
        is_pricing: !!data.is_pricing,
        is_budget_only: !!data.is_budget_only,
      };

      const budgetBook = await budgetBooksServices.addBudgetBooks(postData);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            budgetBook,
            "Budget Book and related project data saved successfully."
          )
        );
    } catch (error) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(error));
      return res.status(400).json({
        status: false,
        message: error.message || "Budget Book creation failed",
        data: {},
      });
    }
  },
};
