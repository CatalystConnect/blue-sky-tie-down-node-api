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
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(422)
          .json(commonHelper.parseErrorRespose(errors.mapped()));
      }

      let data = req.body;

      // ✅ Parse form safely
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

      // ✅ Prepare post data
      const postData = {
        user_id: req.userId || null,
        name: data.name || null,
        engineer_id: data.engineer_id || null,
        project_id: data.project_id || null,
        lead_id: data.lead_id || null,
        customer_id: data.customer_id || null,
        contact_id: data.contact_id || null,
        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
        zip: data.zip || null,
        quote_date: data.quote_date || null,
        job_no: data.job_no || null,
        plan_date: data.plan_date || null,
        plan_status: data.plan_status || null,
        plan_info: data.plan_info || null,
        plan_note: data.plan_note || null,
        up_margin: data.up_margin || null,
        sp_margin: data.sp_margin || null,
        mc_margin: data.mc_margin || null,
        sw_margin: data.sw_margin || null,
        total_adders: data.total_adders || null,
        total_calculate: data.total_calculate || null,
        total: data.total || null,
        is_pricing: Boolean(data.is_pricing),
        is_budget_only: Boolean(data.is_budget_only),
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
        shipping: data.shipping || null,
        shipping_total: data.shipping_total || null,
        shipping_ship: data.shipping_ship || null,
        shipping_shipment: data.shipping_shipment || null,
        per_sqft: data.per_sqft || null,
        bldg_count: data.bldg_count || null,
        bldg_gsqft: data.bldg_gsqft || null,
        bldg_cost: data.bldg_cost || null,
        bldg_sqft: data.bldg_sqft || null,
        bldg_price: data.bldg_price || null,
        price: data.price || null,
        sw_tiedown: data.sw_tiedown || null,
        up_lift: data.up_lift || null,
        misc: data.misc || null,
        anchorage: data.anchorage || null,
        commission: data.commission || null,
        commission_rate: data.commission_rate || null,
        shipment_limit: data.shipment_limit || null,
        fill_in_limit: data.fill_in_limit || null,
        seal_limit: data.seal_limit || null,
        limit_notes: data.limit_notes || null,
        terms: data.terms || null,
        tax: data.tax || null,
        projectType: data.projectType || null,
      };

      // ✅ Create main budget book first
      const budgetBook = await budgetBooksServices.addBudgetBooks(postData);

      // ✅ Send success response IMMEDIATELY (Heroku safe)
      res.status(200).json({
        status: true,
        message: "Budget Book creation started",
        budgetBook,
      });

      // ✅ Now process related inserts in background
      setImmediate(async () => {
        try {
          const {
            budgetBooksScopeIncludes,
            budgetBooksDrawings,
            budgetBooksKeyAreas,
            budgetBooksContracts,
            sites,
            budgets,
            sitePlan,
            scopeOther,
            sitePlan2,
            veOptions,
            optionPackages,
            scopes,
          } = data;

          const promises = [];

          if (
            Array.isArray(budgetBooksScopeIncludes) &&
            budgetBooksScopeIncludes.length
          ) {
            promises.push(
              db.budgetBooksScopeIncludesObj.bulkCreate(
                budgetBooksScopeIncludes.map((item) => ({
                  budget_books_id: budgetBook.id,
                  budget_category_id: item.budget_category_id,
                  is_include: item.is_include,
                  is_exclude: item.is_exclude,
                }))
              )
            );
          }

          if (
            Array.isArray(budgetBooksDrawings) &&
            budgetBooksDrawings.length
          ) {
            promises.push(
              db.budgetBooksDrawingsObj.bulkCreate(
                budgetBooksDrawings.map((item) => ({
                  budget_books_id: budgetBook.id,
                  submittal_id: item.submittal_id,
                  is_include: item.is_include,
                }))
              )
            );
          }

          if (
            Array.isArray(budgetBooksKeyAreas) &&
            budgetBooksKeyAreas.length
          ) {
            promises.push(
              db.budgetBooksKeyAreasObj.bulkCreate(
                budgetBooksKeyAreas.map((item) => ({
                  budget_books_id: budgetBook.id,
                  key_area_id: item.key_area_id,
                  is_include: item.is_include,
                }))
              )
            );
          }

          if (
            Array.isArray(budgetBooksContracts) &&
            budgetBooksContracts.length
          ) {
            promises.push(
              db.budgetBooksContractsObj.bulkCreate(
                budgetBooksContracts.map((item) => ({
                  budget_books_id: budgetBook.id,
                  contract_component_id: item.contract_component_id,
                  is_include: item.is_include,
                }))
              )
            );
          }

          if (Array.isArray(sites) && sites.length) {
            promises.push(
              db.budgetBooksSitesObj.bulkCreate(
                sites.map((site) => ({
                  budget_books_id: budgetBook.id,
                  name: site.name || "",
                  site_id: site.site_Id || "",
                  qty: site.qty || "",
                  gs_qft: site.gs_qft || "",
                  ts_qft: site.ts_qft || "",
                  cs_qft: site.cs_qft || "",
                  ps_qft: site.ps_qft || "",
                  cost: site.cost || "",
                  c_total: site.c_total || "",
                  c_sw: site.c_sw || "",
                  c_up: site.c_up || "",
                  c_sp: site.c_sp || "",
                  c_mc: site.c_mc || "",
                  pb_sw: site.pb_sw || "",
                  pb_up: site.pb_up || "",
                  pb_sp: site.pb_sp || "",
                  pb_mc: site.pb_mc || "",
                  pb_tot: site.pb_tot || "",
                  p_tot: site.p_tot || "",
                  p_sw: site.p_sw || "",
                  p_up: site.p_up || "",
                  p_sp: site.p_sp || "",
                  p_mc: site.p_mc || "",
                  project_bldg: site.project_bldg || "",
                  project_bldg_type: site.project_bldg_type || "",
                  site_design: site.site_design || "",
                  site_design_sw: site.site_design_sw || "",
                  site_design_up: site.site_design_up || "",
                  site_engineering: site.site_engineering || "",
                  site_engineering_sw: site.site_engineering_sw || "",
                  site_engineering_up: site.site_engineering_up || "",
                  site_budget: site.site_budget || "",
                  site_budget_sp: site.site_budget_sp || "",
                  site_budget_sw: site.site_budget_sw || "",
                  site_budget_up: site.site_budget_up || "",
                  site_budget_mc: site.site_budget_mc || "",
                  site_shipping: site.site_shipping || "",
                  site_shipping_sp: site.site_shipping_sp || "",
                  site_shipping_sw: site.site_shipping_sw || "",
                  site_shipping_up: site.site_shipping_up || "",
                  site_shipping_mc: site.site_shipping_mc || "",
                  site_design_type: site.site_design_type || "",
                  site_engineering_type: site.site_engineering_type || "",
                  site_budget_type: site.site_budget_type || "",
                  site_shipping_type: site.site_shipping_type || "",
                }))
              )
            );
          }

          if (Array.isArray(budgets) && budgets.length) {
            promises.push(
              db.projectBudgetsObj.bulkCreate(
                budgets.map((item) => ({
                  budget_books_id: budgetBook.id || null,
                  site_name: item.site_name || "",
                  misc: item.misc || "",
                  posts: item.posts || "",
                  sill_plate: item.sill_plate || "",
                  tie_down: item.tie_down || "",
                  sw_misc: item.sw_misc || "",
                  up_lift: item.up_lift || "",
                  roof: item.roof || "",
                  coridor: item.coridor || "",
                  deck: item.deck || "",
                  stair_wells: item.stair_wells || "",
                  beam: item.beam || "",
                  cmu: item.cmu || "",
                  stl: item.stl || "",
                  rtu: item.rtu || "",
                  budget_total: item.budget_total || "",
                  sqft_sw_tiedown: item.sqft_sw_tiedown || "",
                  sqft_up_lift: item.sqft_up_lift || "",
                  sqft_sill_plate: item.sqft_sill_plate || "",
                  sqft_misc_hardware: item.sqft_misc_hardware || "",
                  cost_sw_tiedown: item.cost_sw_tiedown || "",
                  cost_up_lift: item.cost_up_lift || "",
                  cost_sill_plate: item.cost_sill_plate || "",
                  cost_misc_hardware: item.cost_misc_hardware || "",
                  total: item.total || "",
                  price_sill_plate: item.price_sill_plate || "",
                  price_sw_tiedown: item.price_sw_tiedown || "",
                  price_up_lift: item.price_up_lift || "",
                  price_misc_hardware: item.price_misc_hardware || "",
                  price_total: item.price_total || "",
                  costType_sw_tiedown: item.costType_sw_tiedown || "",
                  costType_up_lift: item.costType_up_lift || "",
                  costType_sill_plate: item.costType_sill_plate || "",
                  costType_misc_hardware: item.costType_misc_hardware || "",
                  costType_Total: item.costType_Total || "",
                  priceType_sw_tiedown: item.priceType_sw_tiedown || "",
                  priceType_up_lift: item.priceType_up_lift || "",
                  priceType_sill_plate: item.priceType_sill_plate || "",
                  priceType_misc_hardware: item.priceType_misc_hardware || "",
                  priceType_total: item.priceType_total || "",
                  cost_roof: item.cost_roof || "",
                  cost_coridor: item.cost_coridor || "",
                  cost_deck: item.cost_deck || "",
                  cost_stair_wells: item.cost_stair_wells || "",
                  cost_beam: item.cost_beam || "",
                  cost_posts: item.cost_posts || "",
                  cost_smu: item.cost_smu || "",
                  cost_stl: item.cost_stl || "",
                  cost_misc: item.cost_misc || "",
                  cost_rtu: item.cost_rtu || "",
                  costType_roof: item.costType_roof || "",
                  costType_coridor: item.costType_coridor || "",
                  costType_deck: item.costType_deck || "",
                  costType_stair_wells: item.costType_stair_wells || "",
                  costType_beam: item.costType_beam || "",
                  costType_posts: item.costType_posts || "",
                  costType_smu: item.costType_smu || "",
                  costType_stl: item.costType_stl || "",
                  costType_misc: item.costType_misc || "",
                  costType_rtu: item.costType_rtu || "",
                  price_roof: item.price_roof || "",
                  price_coridor: item.price_coridor || "",
                  price_deck: item.price_deck || "",
                  price_stair_wells: item.price_stair_wells || "",
                  price_beam: item.price_beam || "",
                  price_posts: item.price_posts || "",
                  price_smu: item.price_smu || "",
                  price_stl: item.price_stl || "",
                  price_misc: item.price_misc || "",
                  price_rtu: item.price_rtu || "",
                  priceType_roof: item.priceType_roof || "",
                  priceType_coridor: item.priceType_coridor || "",
                  priceType_deck: item.priceType_deck || "",
                  priceType_stair_wells: item.priceType_stair_wells || "",
                  priceType_beam: item.priceType_beam || "",
                  priceType_posts: item.priceType_posts || "",
                  priceType_smu: item.priceType_smu || "",
                  priceType_stl: item.priceType_stl || "",
                  priceType_misc: item.priceType_misc || "",
                  priceType_rtu: item.priceType_rtu || "",
                  category1: item.category1 || "",
                  ssd: item.ssd || "",
                  undefined: item.undefined || "",
                }))
              )
            );
          }

          if (Array.isArray(sitePlan) && sitePlan.length) {
            promises.push(
              db.sitePlansObj.bulkCreate(
                sitePlan.map((item) => ({
                  budget_books_id: budgetBook.id,
                  site_index: item.site_index || null,
                  bldg_id: item.bldg_id || null,
                  site_plan_name: item.sitePlan_name || null,
                  sov_sp: item.sov_sp || null,
                  sov_td: item.sov_td || null,
                  sov_up: item.sov_up || null,
                  sov_mc: item.sov_mc || null,
                  sov_total: item.sov_total || null,
                  order_no: item.order_no || null,
                }))
              )
            );
          }
          if (Array.isArray(scopeOther) && scopeOther.length) {
            for (const [nestedIndex, siteGroup] of Object.entries(scopeOther)) {
              // Loop each site block
              for (const [budgetCatKey, budgetCatArray] of Object.entries(
                siteGroup
              )) {
                // Skip invalid keys or empty data
                if (budgetCatKey === "data" || !Array.isArray(budgetCatArray))
                  continue;

                for (const item of budgetCatArray) {
                  const siteId = item.siteId || null;
                  const budgetCatId = item.budget_Cat_Id || null;

                  if (!item.data || !Array.isArray(item.data)) continue;

                  // Filter only valid (non-empty) entries
                  const validDataEntries = item.data.filter((data) =>
                    Object.values(data || {}).some(
                      (v) => v !== null && v !== ""
                    )
                  );

                  if (validDataEntries.length) {
                    const insertData = validDataEntries.map((data) => ({
                      title: data.title || "Other",
                      budget_id: budgetBook.id, // your current main budgetBook record
                      site_id: siteId,
                      scopeId: data.scopeId || null,
                      site_plan_id: sitePlanMap?.[nestedIndex] || null,
                      budget_cat_id: budgetCatId,
                      is_include: data.is_include || null,
                      total: data.total || null,
                      price_sqft: data.pricePerSqft || null,
                      additionals: data.additional || null,
                      cost: data.cost || null,
                      price_w_additional: data.priceWithAdditional || null,
                      costSqft: data.costSqft || null,
                      optionPercentage: data.optionPercentage || null,
                    }));

                    if (insertData.length) {
                      promises.push(
                        db.budgetBookOthersObj.bulkCreate(insertData)
                      );
                    }
                  }
                }
              }
            }
          }

          if (Array.isArray(sitePlan2) && sitePlan2.length) {
            promises.push(
              db.sitePlanItemsObj.bulkCreate(
                sitePlan2.map((item) => ({
                  budget_books_id: budgetBook.id,
                  sitePlan_name2: item.sitePlan_name2 || null,
                  site_qty: item.site_qty || null,
                  sov_qa: item.sov_qa || null,
                  sov_qr: item.sov_qr || null,
                }))
              )
            );
          }

          if (Array.isArray(veOptions) && veOptions.length) {
            promises.push(
              db.veOptionsObj.bulkCreate(
                veOptions.map((item) => ({
                  budget_books_id: budgetBook.id,
                  subject: item.subject || null,
                  description: item.description || null,
                  amount: item.amount || null,
                  optionDate: item.optionDate || null,
                  groups: item.groups || null,
                }))
              )
            );
          }
          if (Array.isArray(optionPackages) && optionPackages.length) {
            promises.push(
              db.optionPackageObj.bulkCreate(
                optionPackages.map((item) => ({
                  budget_books_id: budgetBook.id,
                  subject: item.subject || null,
                  description: item.description || null,
                  amount: item.amount || null,
                  groups: item.groups || null,
                }))
              )
            );
          }
          if (Array.isArray(scopes) && scopes.length) {
            for (const group of scopes) {
              const otherItems = group.other || [];

              for (const [key, scope] of Object.entries(group)) {
                if (!scope || !scope.scope_id) continue;

                // ---- Create budgetBooksScopes ----
                const budgetBooksScope = await db.budgetBooksScopesObj.create({
                  budget_books_id: budgetBook.id,
                  is_include: scope.inc || null,
                  scope_id: scope.scope_id,
                  title: scope.scope_name || "",
                });

                // ---- Create budgetBooksScopeCategories ----
                const budgetBooksScopeCategory =
                  await db.budgetBooksScopeCategoriesObj.create({
                    budget_books_scope_id: budgetBooksScope.id,
                    scope_category_id: scope.scope_category_id || null,
                    title: scope.category_name || "",
                  });

                // ---- Create budgetBooksScopeGroups ----
                const budgetBooksScopeGroup =
                  await db.budgetBooksScopeGroupsObj.create({
                    budget_books_scope_category_id: budgetBooksScopeCategory.id,
                    scope_group_id: scope.group_id || null,
                    title: scope.group_name || "",
                  });

                const segmentId = scope.segment_id || null;

                if (segmentId) {
                  let priceWithAdditional = scope.priceWithAdditional || 0;
                  if (
                    isNaN(priceWithAdditional) ||
                    ["infinity", "nan"].includes(
                      String(priceWithAdditional).toLowerCase()
                    )
                  ) {
                    priceWithAdditional = 0.0;
                  }

                  // ---- Create budgetBooksScopeSegments ----
                  await db.budgetBooksScopeSegmentsObj.create({
                    budget_books_scope_group_id: budgetBooksScopeGroup.id,
                    scope_sagment_id: segmentId,
                    title: scope.segment_name || "",
                    notes: scope.notes || "",
                    client_notes: scope.client_notes || "",
                    is_include: scope.is_include || "",
                    acc: scope.acc || "",
                    internal_notes: scope.internal_notes || "",
                    price_sqft: scope.pricePerSqft || 0,
                    additionals: scope.additional || 0,
                    price_w_additional: priceWithAdditional,
                    budget_Cat_Id: scope.scope_category_id || null,
                    cost: scope.cost || 0,
                    costSqft: scope.costSqft || 0,
                    total: scope.total || 0,
                    conditions: Array.isArray(scope.condition)
                      ? scope.condition.join(", ")
                      : scope.condition || null,
                    site_id: scope.site_id || null,
                    scopeId: scope.scope_id || null,
                    optionPercentage: scope.optionPercentage || null,
                    budgetIndex: scope.budgetIndex || null,
                  });
                }
              }
            }
          }

          await Promise.all(promises);

          console.log(
            "✅ Background data saved for budgetBook ID:",
            budgetBook.id
          );
        } catch (err) {
          console.error("❌ Background insert error:", err.message);
        }
      });
    } catch (error) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(error));
      return res.status(500).json({
        status: false,
        message: error.message || "Budget Book creation failed",
        data: {},
      });
    }
  },
  async getAllBudgetBooks(req, res) {
    try {
      let { page = "1", per_page = "10", take_all = "" } = req.query;

      // Convert page and per_page to integers
      page = parseInt(page) || 1;
      per_page = parseInt(per_page) || 10;

      // Handle take_all="all"
      take_all = take_all === "all";

      // Call service
      const { data: budgetBooks, meta } =
        await budgetBooksServices.getAllBudgetBooks({
          page,
          per_page,
          take_all,
        });

      return res.status(200).json({
        status: true,
        message: "Budget Books fetched successfully",
        data: budgetBooks,
        meta,
      });
    } catch (error) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(error));
      return res.status(500).json({
        status: false,
        message: error.message || "Failed to fetch Budget Books",
        data: [],
      });
    }
  },

  async getBudgetBooksById(req, res) {
    try {
      const budgetBooksId = req.query.id || req.params.id;

      if (!budgetBooksId) {
        return res.status(400).json({
          status: false,
          message: "budgetBooksId is required",
          data: [],
        });
      }

      const budgetBook = await budgetBooksServices.getBudgetBooksById(
        budgetBooksId
      );

      if (!budgetBook) {
        return res.status(404).json({
          status: false,
          message: "Budget Book not found",
          data: [],
        });
      }

      return res.status(200).json({
        status: true,
        message: "Budget Book fetched successfully",
        data: budgetBook,
      });
    } catch (error) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(error));
      return res.status(500).json({
        status: false,
        message: error.message || "Failed to fetch Budget Book",
        data: [],
      });
    }
  },

  async updateBudgetBooks(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(422)
          .json(commonHelper.parseErrorRespose(errors.mapped()));
      }

      let data = req.body;

      // Handle form-data JSON string
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

      const id = req.query.id; // Use ?id=2
      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Missing budget book ID (id).",
        });
      }

      const postData = {
        user_id: req.userId || null,
        name: data.name || null,
        engineer_id: data.engineer_id || null,
        project_id: data.project_id || null,
        lead_id: data.lead_id || null,
        customer_id: data.customer_id || null,
        contact_id: data.contact_id || null,
        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
        zip: data.zip || null,
        quote_date: data.quote_date || null,
        job_no: data.job_no || null,
        plan_date: data.plan_date || null,
        plan_status: data.plan_status || null,
        plan_info: data.plan_info || null,
        plan_note: data.plan_note || null,
        up_margin: data.up_margin || null,
        sp_margin: data.sp_margin || null,
        mc_margin: data.mc_margin || null,
        sw_margin: data.sw_margin || null,
        total_adders: data.total_adders || null,
        total_calculate: data.total_calculate || null,
        total: data.total || null,
        is_pricing: Boolean(data.is_pricing),
        is_budget_only: Boolean(data.is_budget_only),
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
        shipping: data.shipping || null,
        shipping_total: data.shipping_total || null,
        shipping_ship: data.shipping_ship || null,
        shipping_shipment: data.shipping_shipment || null,
        per_sqft: data.per_sqft || null,
        bldg_count: data.bldg_count || null,
        bldg_gsqft: data.bldg_gsqft || null,
        bldg_cost: data.bldg_cost || null,
        bldg_sqft: data.bldg_sqft || null,
        bldg_price: data.bldg_price || null,
        price: data.price || null,
        sw_tiedown: data.sw_tiedown || null,
        up_lift: data.up_lift || null,
        misc: data.misc || null,
        anchorage: data.anchorage || null,
        commission: data.commission || null,
        commission_rate: data.commission_rate || null,
        shipment_limit: data.shipment_limit || null,
        fill_in_limit: data.fill_in_limit || null,
        seal_limit: data.seal_limit || null,
        limit_notes: data.limit_notes || null,
        terms: data.terms || null,
        tax: data.tax || null,
        projectType: data.projectType || null,
      };

      // Call service
      const updatedBudgetBook = await budgetBooksServices.updateBudgetBooks(
        id,
        postData
      );

      const {
        budgetBooksScopeIncludes,
        budgetBooksDrawings,
        budgetBooksKeyAreas,
        budgetBooksContracts,
      } = data;

      // Delete old associations and insert new ones
      await budgetBooksServices.replaceAssociations(id, {
        budgetBooksScopeIncludes,
        budgetBooksDrawings,
        budgetBooksKeyAreas,
        budgetBooksContracts,
      });

      return res
        .status(200)
        .json(
          commonHelper.parseSuccessRespose(
            updatedBudgetBook,
            "Budget Book and related project data updated successfully."
          )
        );
    } catch (error) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(error));
      return res.status(500).json({
        status: false,
        message: error.message || "Budget Book update failed",
        data: {},
      });
    }
  },

  async deleteBudgetBooks(req, res) {
    try {
      const budgetBooksId = req.query.id || req.params.id;

      if (!budgetBooksId) {
        return res.status(400).json({
          status: false,
          message: "budgetBooksId is required",
          data: [],
        });
      }

      const deleted = await budgetBooksServices.deleteBudgetBooks(
        budgetBooksId
      );

      if (!deleted) {
        return res.status(404).json({
          status: false,
          message: "Budget Book not found or already deleted",
          data: [],
        });
      }

      return res.status(200).json({
        status: true,
        message: "Budget Book and related data deleted successfully",
        data: {},
      });
    } catch (error) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(error));
      return res.status(500).json({
        status: false,
        message: error.message || "Failed to delete Budget Book",
        data: [],
      });
    }
  },

  async getAllBudgetCategory(req, res) {
    try {
      const data = await budgetBooksServices.getAllBudgetCategory();

      if (!data.length) {
        return res.status(404).json({
          status: false,
          message: "No record found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Budget Categories fetched successfully",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Failed to fetch Budget Categories",
        error: error.message,
      });
    }
  },
};
