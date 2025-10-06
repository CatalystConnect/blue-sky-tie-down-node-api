require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator"); // Updated import
const budgetBooksServices = require("../services/budgetBooks.services");
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});
const db = require("../models");

module.exports = {
  /*addBudgetBooks*/
  async addBudgetBooks(req, res) {
    try {
      // 1️⃣ Validate request
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(422)
          .json(commonHelper.parseErrorRespose(errors.mapped()));
      }

      // 2️⃣ Parse JSON form if sent as string
      let data = req.body;
      if (typeof data.form === "string") {
        try {
          data = JSON.parse(data.form);
        } catch (err) {
          return res.status(400).json({
            status: false,
            message: "Invalid JSON in 'form' field.",
          });
        }
      }

      console.log("Received Data:", data);

      // 3️⃣ Build main BudgetBook data
      const postData = {
        user_id: req.userId || null,
        name: data.name || null,
        engineer_id: data.engineer_id || null,
        budget_book_id: data.budget_book_id || null,
        customer_id: data.customer_id || null,
        contact_id: data.contact_id || null,
        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
        zip: data.zip || null,
        quote_date: data.quote_date || null,
        job_no: data.job_no || null,

        // Plan Details
        plan_date: data.plan_date || null,
        plan_status: data.plan_status || null,
        plan_info: data.plan_info || null,
        plan_note: data.plan_note || null,

        // Margins
        up_margin: data.up_margin || null,
        sp_margin: data.sp_margin || null,
        mc_margin: data.mc_margin || null,
        sw_margin: data.sw_margin || null,

        // Totals
        total_adders: data.total_adders || null,
        total_calculate: data.total_calculate || null,
        total: data.total || null,

        // Boolean flags
        is_pricing: Boolean(data.is_pricing),
        is_budget_only: Boolean(data.is_budget_only),

        // Budget Info
        design: data.design || null,
        design_total: data.design_total || null,
        design_hr: data.design_hr || null,
        design_hrs: data.design_hrs || null,
        engineering: data.engineering || null,
        engineering_total: data.engineering_total || null,
        engineering_seal: data.engineering_seal || null,
        engineering_seals: data.engineering_seals || null,
        budget: data.budget || null,
        budget_total: data.budget_total || null,
        budget_hr: data.budget_hr || null,
        budget_hrs: data.budget_hrs || null,

        // Shipping
        shipping: data.shipping || null,
        shipping_total: data.shipping_total || null,
        shipping_ship: data.shipping_ship || null,
        shipping_shipment: data.shipping_shipment || null,

        // Buildings
        per_sqft: data.per_sqft || null,
        bldg_count: data.bldg_count || null,
        bldg_gsqft: data.bldg_gsqft || null,
        bldg_cost: data.bldg_cost || null,
        bldg_sqft: data.bldg_sqft || null,
        bldg_price: data.bldg_price || null,
        price: data.price || null,

        // Misc
        sw_tiedown: data.sw_tiedown || null,
        up_lift: data.up_lift || null,
        misc: data.misc || null,
        anchorage: data.anchorage || null,

        // Limits & Notes
        commission: data.commission || null,
        commission_rate: data.commission_rate || null,
        shipment_limit: data.shipment_limit || null,
        fill_in_limit: data.fill_in_limit || null,
        seal_limit: data.seal_limit || null,
        limit_notes: data.limit_notes || null,

        // Terms & Tax
        terms: data.terms || null,
        tax: data.tax || null,
        projectType: data.projectType || null,
      };

      // 4️⃣ Create BudgetBook
      const budgetBook = await budgetBooksServices.addBudgetBooks(postData);

      // 5️⃣ Insert related tables in parallel
      const {
        projectScopeIncludes,
        projectSubmittals,
        projectKeyAreas,
        projectContracts,
      } = data;

      const promises = [];

      if (Array.isArray(projectScopeIncludes) && projectScopeIncludes.length) {
        promises.push(
          await db.projectScopeIncludesObj.bulkCreate(
            projectScopeIncludes.map((item) => ({
              budget_book_id: budgetBook.id,
              budget_category_id: item.budget_category_id,
              is_include: item.is_include,
              is_exclude: item.is_exclude,
            }))
          )
        );
      }

      if (Array.isArray(projectSubmittals) && projectSubmittals.length) {
        promises.push(
          await db.projectDrawingsObj.bulkCreate(
            projectSubmittals.map((item) => ({
              budget_book_id: budgetBook.id,
              submittal_id: item.submittal_id,
              is_include: item.is_include,
            }))
          )
        );
      }

      if (Array.isArray(projectKeyAreas) && projectKeyAreas.length) {
        promises.push(
          await db.projectKeyAreasObj.bulkCreate(
            projectKeyAreas.map((item) => ({
              budget_book_id: budgetBook.id,
              key_area_id: item.key_area_id,
              is_include: item.is_include,
            }))
          )
        );
      }

      if (Array.isArray(projectContracts) && projectContracts.length) {
        promises.push(
          await db.projectContractsObj.bulkCreate(
            projectContracts.map((item) => ({
              budget_book_id: budgetBook.id,
              contract_component_id: item.contract_component_id,
              is_include: item.is_include,
            }))
          )
        );
      }

      // Wait for all related inserts
      await Promise.all(promises);

      // 6️⃣ Return response
      return res
        .status(200)
        .json(
          commonHelper.parseSuccessRespose(
            budgetBook,
            "✅ Budget Book and related project data saved successfully."
          )
        );
    } catch (error) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(error));
      return res.status(500).json({
        status: false,
        message: error.message || "❌ Budget Book creation failed",
        data: {},
      });
    }
  },

  // async getAllBudgetBooks(req, res) {
  //   try {
  //     // Fetch all budget books
  //     const budgetBooks = await budgetBooksServices.getAllBudgetBooks();
  
  //     return res.status(200).json({
  //       status: true,
  //       message: "✅ Budget Books fetched successfully",
  //       data: budgetBooks,
  //     });
  //   } catch (error) {
  //     logger.errorLog.log("error", commonHelper.customizeCatchMsg(error));
  //     return res.status(500).json({
  //       status: false,
  //       message: error.message || "❌ Failed to fetch Budget Books",
  //       data: [],
  //     });
  //   }
  // }
  
};
