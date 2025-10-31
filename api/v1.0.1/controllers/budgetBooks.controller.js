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
const fs = require("fs");
const path = require("path");
const {
  uploadFileToDrive,
  getOrCreateSubfolder,
} = require("../helper/googleDrive");
const projectServices = require("../services/project.services");

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
      let documentData = req.body;

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
        taxRate: data.taxRate || null,
        contact_email: data.contact_email || null,
      };

      const budgetBook = await budgetBooksServices.addBudgetBooks(postData);

      const project = await projectServices.getProjectById(data.project_id);

      const saveFolder = async (module, module_id, drive_id, file_name) =>
        await projectServices.addDriveAssociation({
          parent: data.project_id,
          module,
          module_id,
          drive_id,
          file_name,
        });

      if (Array.isArray(req.files) && req.files.length) {
        const budgetUploads = req.files.filter((f) =>
          f.fieldname.startsWith("uploadDocument")
        );

        if (budgetUploads.length) {
          const mainFolder = await getOrCreateSubfolder(
            process.env.GOOGLE_DRIVE_FOLDER_ID,
            `${data.project_id}. ${project.name}`
          );

          const budgetFolder = await getOrCreateSubfolder(
            mainFolder,
            "budgetFiles"
          );

          for (const [index, file] of budgetUploads.entries()) {
            try {
              const driveFile = await uploadFileToDrive(
                file.path,
                file.originalname,
                file.mimetype,
                budgetFolder
              );

              const uploadMeta = documentData.uploadDocument?.[index] || {};

              let doc = await db.budgetBookDocumentsObj.create({
                budget_book_id: budgetBook.id,
                file_name: file.originalname,
                notes: uploadMeta.note || null,
                type: uploadMeta.type || null,
                is_display: uploadMeta.displayToCustomer || null,
                file_path: driveFile.webViewLink,
              });
              await saveFolder(
                "budgetFiles",
                doc.id,
                driveFile.id,
                file.originalname
              );
            } catch (err) {
              console.error(" File upload failed:", err);
            }
          }
        }
      }

      res.status(200).json({
        status: true,
        message: "Budget Book creation started",
        budgetBook,
      });

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
            uploadDocument,
          } = data;

          const promises = [];
          const parseNumber = (val) => {
            if (val === "" || val === null || val === undefined) return null;
            return Number(val);
          };

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
          // if (Array.isArray(sites) && sites.length) {
          //   const cleanSites = sites.filter((s) => {
          //     if (!s || typeof s !== "object") return false;

          //     const hasValidName = s.name && s.name.trim() !== "";
          //     const hasValidId = s.site_Id && s.site_Id.trim() !== "";

          //     const hasMeaningfulData = Object.values(s).some(
          //       (v) => v !== null && v !== "" && v !== undefined
          //     );

          //     return hasValidName && hasValidId && hasMeaningfulData;
          //   });

          //   if (cleanSites.length) {
          //     const mappedSites = cleanSites.map((site) => ({
          //       budget_books_id: budgetBook.id,
          //       name: site.name || "",
          //       site_Id: site.site_Id || "",
          //       qty: site.qty || null,
          //       gs_qft: site.gs_qft || null,
          //       ts_qft: site.ts_qft || null,
          //       cs_qft: site.cs_qft || null,
          //       ps_qft: site.ps_qft || null,
          //       cost: site.cost || null,
          //       c_total: site.c_total || null,
          //       c_sw: site.c_sw || null,
          //       c_up: site.c_up || null,
          //       c_sp: site.c_sp || null,
          //       c_mc: site.c_mc || null,
          //       pb_sw: site.pb_sw || null,
          //       pb_up: site.pb_up || null,
          //       pb_sp: site.pb_sp || null,
          //       pb_mc: site.pb_mc || null,
          //       pb_tot: site.pb_tot || null,
          //       p_tot: site.p_tot || null,
          //       p_sw: site.p_sw || null,
          //       p_up: site.p_up || null,
          //       p_sp: site.p_sp || null,
          //       p_mc: site.p_mc || null,
          //       project_bldg: site.project_bldg || null,
          //       project_bldg_type: site.project_bldg_type || null,
          //       site_design: site.site_design || null,
          //       site_design_sw: site.site_design_sw || null,
          //       site_design_up: site.site_design_up || null,
          //       site_engineering: site.site_engineering || null,
          //       site_engineering_sw: site.site_engineering_sw || null,
          //       site_engineering_up: site.site_engineering_up || null,
          //       site_budget: site.site_budget || null,
          //       site_budget_sp: site.site_budget_sp || null,
          //       site_budget_sw: site.site_budget_sw || null,
          //       site_budget_up: site.site_budget_up || null,
          //       site_budget_mc: site.site_budget_mc || null,
          //       site_shipping: site.site_shipping || null,
          //       site_shipping_sp: site.site_shipping_sp || null,
          //       site_shipping_sw: site.site_shipping_sw || null,
          //       site_shipping_up: site.site_shipping_up || null,
          //       site_shipping_mc: site.site_shipping_mc || null,
          //       site_design_type: site.site_design_type || null,
          //       site_engineering_type: site.site_engineering_type || null,
          //       site_budget_type: site.site_budget_type || null,
          //       site_shipping_type: site.site_shipping_type || null,
          //     }));

          //     if (mappedSites.length) {
          //       promises.push(db.budgetBooksSitesObj.bulkCreate(mappedSites));
          //     }
          //   }

          // }
          // if (Array.isArray(budgets) && budgets.length ) {
          //   const budgetRecords = budgets.map((item) => {
          //     return {
          //       budget_books_id: budgetBook.id ?? null,
          //       site_name: item.site_name || null,
          //       misc: item.misc || null,
          //       posts: item.posts || null,
          //       sill_plate: parseNumber(item.sill_plate),
          //       tie_down: parseNumber(item.tie_down),
          //       sw_misc: parseNumber(item.sw_misc),
          //       up_lift: parseNumber(item.up_lift),
          //       roof: parseNumber(item.roof),
          //       coridor: parseNumber(item.coridor),
          //       deck: parseNumber(item.deck),
          //       stair_wells: parseNumber(item.stair_wells),
          //       beam: parseNumber(item.beam),
          //       cmu: parseNumber(item.cmu),
          //       stl: parseNumber(item.stl),
          //       rtu: parseNumber(item.rtu),
          //       budget_total: parseNumber(item.budget_total),
          //       sqft_sw_tiedown: parseNumber(item.sqft_sw_tiedown),
          //       sqft_up_lift: parseNumber(item.sqft_up_lift),
          //       sqft_sill_plate: parseNumber(item.sqft_sill_plate),
          //       sqft_misc_hardware: parseNumber(item.sqft_misc_hardware),
          //       cost_sw_tiedown: parseNumber(item.cost_sw_tiedown),
          //       cost_up_lift: parseNumber(item.cost_up_lift),
          //       cost_sill_plate: parseNumber(item.cost_sill_plate),
          //       cost_misc_hardware: parseNumber(item.cost_misc_hardware),
          //       total: parseNumber(item.total),
          //       price_sill_plate: parseNumber(item.price_sill_plate),
          //       price_sw_tiedown: parseNumber(item.price_sw_tiedown),
          //       price_up_lift: parseNumber(item.price_up_lift),
          //       price_misc_hardware: parseNumber(item.price_misc_hardware),
          //       price_total: parseNumber(item.price_total),
          //       costType_sw_tiedown: parseNumber(item.costType_sw_tiedown),
          //       costType_up_lift: parseNumber(item.costType_up_lift),
          //       costType_sill_plate: parseNumber(item.costType_sill_plate),
          //       costType_misc_hardware: parseNumber(
          //         item.costType_misc_hardware
          //       ),
          //       costType_Total: parseNumber(item.costType_Total),
          //       priceType_sw_tiedown: parseNumber(item.priceType_sw_tiedown),
          //       priceType_up_lift: parseNumber(item.priceType_up_lift),
          //       priceType_sill_plate: parseNumber(item.priceType_sill_plate),
          //       priceType_misc_hardware: parseNumber(
          //         item.priceType_misc_hardware
          //       ),
          //       priceType_total: parseNumber(item.priceType_total),
          //       cost_roof: parseNumber(item.cost_roof),
          //       cost_coridor: parseNumber(item.cost_coridor),
          //       cost_deck: parseNumber(item.cost_deck),
          //       cost_stair_wells: parseNumber(item.cost_stair_wells),
          //       cost_beam: parseNumber(item.cost_beam),
          //       cost_posts: parseNumber(item.cost_posts),
          //       cost_smu: parseNumber(item.cost_smu),
          //       cost_stl: parseNumber(item.cost_stl),
          //       cost_misc: parseNumber(item.cost_misc),
          //       cost_rtu: parseNumber(item.cost_rtu),
          //       costType_roof: parseNumber(item.costType_roof),
          //       costType_coridor: parseNumber(item.costType_coridor),
          //       costType_deck: parseNumber(item.costType_deck),
          //       costType_stair_wells: parseNumber(item.costType_stair_wells),
          //       costType_beam: parseNumber(item.costType_beam),
          //       costType_posts: parseNumber(item.costType_posts),
          //       costType_smu: parseNumber(item.costType_smu),
          //       costType_stl: parseNumber(item.costType_stl),
          //       costType_misc: parseNumber(item.costType_misc),
          //       costType_rtu: parseNumber(item.costType_rtu),
          //       price_roof: parseNumber(item.price_roof),
          //       price_coridor: parseNumber(item.price_coridor),
          //       price_deck: parseNumber(item.price_deck),
          //       price_stair_wells: parseNumber(item.price_stair_wells),
          //       price_beam: parseNumber(item.price_beam),
          //       price_posts: parseNumber(item.price_posts),
          //       price_smu: parseNumber(item.price_smu),
          //       price_stl: parseNumber(item.price_stl),
          //       price_misc: parseNumber(item.price_misc),
          //       price_rtu: parseNumber(item.price_rtu),
          //       priceType_roof: parseNumber(item.priceType_roof),
          //       priceType_coridor: parseNumber(item.priceType_coridor),
          //       priceType_deck: parseNumber(item.priceType_deck),
          //       priceType_stair_wells: parseNumber(
          //         item.priceType_stair_wells
          //       ),
          //       priceType_beam: parseNumber(item.priceType_beam),
          //       priceType_posts: parseNumber(item.priceType_posts),
          //       priceType_smu: parseNumber(item.priceType_smu),
          //       priceType_stl: parseNumber(item.priceType_stl),
          //       priceType_misc: parseNumber(item.priceType_misc),
          //       priceType_rtu: parseNumber(item.priceType_rtu),
          //     };
          //   });

          //   await db.projectBudgetsObj.bulkCreate(budgetRecords);
          // }

          // ---- Insert Sites ----
          if (Array.isArray(sites) && sites.length) {
            const mappedSites = sites.map((site) => ({
              budget_books_id: budgetBook.id,
              name: site.name || "",
              site_Id: site.site_Id || "",
              qty: site.qty || null,
              gs_qft: site.gs_qft || null,
              ts_qft: site.ts_qft || null,
              cs_qft: site.cs_qft || null,
              ps_qft: site.ps_qft || null,
              cost: site.cost || null,
              c_total: site.c_total || null,
              c_sw: site.c_sw || null,
              c_up: site.c_up || null,
              c_sp: site.c_sp || null,
              c_mc: site.c_mc || null,
              pb_sw: site.pb_sw || null,
              pb_up: site.pb_up || null,
              pb_sp: site.pb_sp || null,
              pb_mc: site.pb_mc || null,
              pb_tot: site.pb_tot || null,
              p_tot: site.p_tot || null,
              p_sw: site.p_sw || null,
              p_up: site.p_up || null,
              p_sp: site.p_sp || null,
              p_mc: site.p_mc || null,
              project_bldg: site.project_bldg || null,
              project_bldg_type: site.project_bldg_type || null,
              site_design: site.site_design || null,
              site_design_sw: site.site_design_sw || null,
              site_design_up: site.site_design_up || null,
              site_engineering: site.site_engineering || null,
              site_engineering_sw: site.site_engineering_sw || null,
              site_engineering_up: site.site_engineering_up || null,
              site_budget: site.site_budget || null,
              site_budget_sp: site.site_budget_sp || null,
              site_budget_sw: site.site_budget_sw || null,
              site_budget_up: site.site_budget_up || null,
              site_budget_mc: site.site_budget_mc || null,
              site_shipping: site.site_shipping || null,
              site_shipping_sp: site.site_shipping_sp || null,
              site_shipping_sw: site.site_shipping_sw || null,
              site_shipping_up: site.site_shipping_up || null,
              site_shipping_mc: site.site_shipping_mc || null,
              site_design_type: site.site_design_type || null,
              site_engineering_type: site.site_engineering_type || null,
              site_budget_type: site.site_budget_type || null,
              site_shipping_type: site.site_shipping_type || null,
            }));

            await db.budgetBooksSitesObj.bulkCreate(mappedSites);
          }

          // ---- Insert Budgets ----
          if (Array.isArray(budgets) && budgets.length) {
            const budgetRecords = budgets.map((item) => ({
              budget_books_id: budgetBook.id ?? null,
              site_name: item.site_name || null,
              misc: item.misc || null,
              posts: item.posts || null,
              sill_plate: parseNumber(item.sill_plate),
              tie_down: parseNumber(item.tie_down),
              sw_misc: parseNumber(item.sw_misc),
              up_lift: parseNumber(item.up_lift),
              roof: parseNumber(item.roof),
              coridor: parseNumber(item.coridor),
              deck: parseNumber(item.deck),
              stair_wells: parseNumber(item.stair_wells),
              beam: parseNumber(item.beam),
              cmu: parseNumber(item.cmu),
              stl: parseNumber(item.stl),
              rtu: parseNumber(item.rtu),
              budget_total: parseNumber(item.budget_total),
              sqft_sw_tiedown: parseNumber(item.sqft_sw_tiedown),
              sqft_up_lift: parseNumber(item.sqft_up_lift),
              sqft_sill_plate: parseNumber(item.sqft_sill_plate),
              sqft_misc_hardware: parseNumber(item.sqft_misc_hardware),
              cost_sw_tiedown: parseNumber(item.cost_sw_tiedown),
              cost_up_lift: parseNumber(item.cost_up_lift),
              cost_sill_plate: parseNumber(item.cost_sill_plate),
              cost_misc_hardware: parseNumber(item.cost_misc_hardware),
              total: parseNumber(item.total),
              price_sill_plate: parseNumber(item.price_sill_plate),
              price_sw_tiedown: parseNumber(item.price_sw_tiedown),
              price_up_lift: parseNumber(item.price_up_lift),
              price_misc_hardware: parseNumber(item.price_misc_hardware),
              price_total: parseNumber(item.price_total),
              costType_sw_tiedown: parseNumber(item.costType_sw_tiedown),
              costType_up_lift: parseNumber(item.costType_up_lift),
              costType_sill_plate: parseNumber(item.costType_sill_plate),
              costType_misc_hardware: parseNumber(item.costType_misc_hardware),
              costType_Total: parseNumber(item.costType_Total),
              priceType_sw_tiedown: parseNumber(item.priceType_sw_tiedown),
              priceType_up_lift: parseNumber(item.priceType_up_lift),
              priceType_sill_plate: parseNumber(item.priceType_sill_plate),
              priceType_misc_hardware: parseNumber(
                item.priceType_misc_hardware
              ),
              priceType_total: parseNumber(item.priceType_total),
              cost_roof: parseNumber(item.cost_roof),
              cost_coridor: parseNumber(item.cost_coridor),
              cost_deck: parseNumber(item.cost_deck),
              cost_stair_wells: parseNumber(item.cost_stair_wells),
              cost_beam: parseNumber(item.cost_beam),
              cost_posts: parseNumber(item.cost_posts),
              cost_smu: parseNumber(item.cost_smu),
              cost_stl: parseNumber(item.cost_stl),
              cost_misc: parseNumber(item.cost_misc),
              cost_rtu: parseNumber(item.cost_rtu),
              costType_roof: parseNumber(item.costType_roof),
              costType_coridor: parseNumber(item.costType_coridor),
              costType_deck: parseNumber(item.costType_deck),
              costType_stair_wells: parseNumber(item.costType_stair_wells),
              costType_beam: parseNumber(item.costType_beam),
              costType_posts: parseNumber(item.costType_posts),
              costType_smu: parseNumber(item.costType_smu),
              costType_stl: parseNumber(item.costType_stl),
              costType_misc: parseNumber(item.costType_misc),
              costType_rtu: parseNumber(item.costType_rtu),
              price_roof: parseNumber(item.price_roof),
              price_coridor: parseNumber(item.price_coridor),
              price_deck: parseNumber(item.price_deck),
              price_stair_wells: parseNumber(item.price_stair_wells),
              price_beam: parseNumber(item.price_beam),
              price_posts: parseNumber(item.price_posts),
              price_smu: parseNumber(item.price_smu),
              price_stl: parseNumber(item.price_stl),
              price_misc: parseNumber(item.price_misc),
              price_rtu: parseNumber(item.price_rtu),
              priceType_roof: parseNumber(item.priceType_roof),
              priceType_coridor: parseNumber(item.priceType_coridor),
              priceType_deck: parseNumber(item.priceType_deck),
              priceType_stair_wells: parseNumber(item.priceType_stair_wells),
              priceType_beam: parseNumber(item.priceType_beam),
              priceType_posts: parseNumber(item.priceType_posts),
              priceType_smu: parseNumber(item.priceType_smu),
              priceType_stl: parseNumber(item.priceType_stl),
              priceType_misc: parseNumber(item.priceType_misc),
              priceType_rtu: parseNumber(item.priceType_rtu),
            }));

            await db.projectBudgetsObj.bulkCreate(budgetRecords);
          }

          const sitePlanMap = [];

          if (Array.isArray(sitePlan) && sitePlan.length) {
            const sitePlanRecords = sitePlan.map((item) => ({
              budget_books_id: budgetBook.id,
              site_index: item.site_index ?? null,
              bldg_id: item.bldg_id ?? null,
              site_plan_name: item.sitePlan_name ?? null,
              sov_sp: item.sov_sp !== "" ? Number(item.sov_sp) : null,
              sov_td: item.sov_td !== "" ? Number(item.sov_td) : null,
              sov_up: item.sov_up !== "" ? Number(item.sov_up) : null,
              sov_mc: item.sov_mc !== "" ? Number(item.sov_mc) : null,
              sov_total: item.sov_total !== "" ? Number(item.sov_total) : null,
              order_no: item.order_no ?? null,
              created_at: new Date(),
              updated_at: new Date(),
            }));

            const createdSitePlans = await db.sitePlansObj.bulkCreate(
              sitePlanRecords
            );

            createdSitePlans.forEach((plan, index) => {
              sitePlanMap[index] = plan.id;
            });
          }

          if (Array.isArray(scopeOther) && scopeOther.length) {
            const toNum = (val) => {
              const num = Number(val);
              return isFinite(num) ? num : null;
            };

            for (
              let siteIndex = 0;
              siteIndex < scopeOther.length;
              siteIndex++
            ) {
              const siteGroup = scopeOther[siteIndex];

              // Each siteGroup is an array: [null, [cat1Items], [cat2Items], ...]
              if (!Array.isArray(siteGroup)) continue;

              // Iterate over each category (skip the first null)
              for (let catIndex = 1; catIndex < siteGroup.length; catIndex++) {
                const categoryArray = siteGroup[catIndex];
                if (!Array.isArray(categoryArray)) continue;

                // Each categoryArray contains multiple item objects
                for (const item of categoryArray) {
                  const siteId = item?.siteId ?? null;
                  const budgetCatId = item?.budget_Cat_Id ?? null;
                  const dataEntries = Object.values(item?.data || {});

                  // Filter only valid, non-empty entries
                  const validEntries = dataEntries.filter((d) =>
                    Object.values(d || {}).some(
                      (v) => v !== null && v !== "" && v !== undefined
                    )
                  );

                  if (!validEntries.length) continue;

                  // Build insertable records
                  const insertData = validEntries.map((d) => ({
                    title: d.title || "Other",
                    budget_id: budgetBook.id,
                    site_id: siteId,
                    site_plan_id: sitePlanMap[siteIndex] ?? null,
                    scopeId: d.scopeId ?? null,
                    budget_cat_id: budgetCatId,
                    is_include: d.is_include ?? null,
                    total: toNum(d.total),
                    price_sqft: toNum(d.pricePerSqft),
                    additionals: toNum(d.additional),
                    cost: toNum(d.cost),
                    price_w_additional: toNum(d.priceWithAdditional),
                    costSqft: toNum(d.costSqft),
                    optionPercentage: toNum(d.optionPercentage),
                    condition: d.condition ?? null, // ✅ Added condition support
                    created_at: new Date(),
                    updated_at: new Date(),
                  }));

                  if (!insertData.length) continue;

                  try {
                    await db.budgetBookOthersObj.bulkCreate(insertData);
                  } catch (error) {
                    console.error(
                      `❌ Error inserting scopeOther (site: ${siteId}, cat: ${budgetCatId}):`,
                      error
                    );
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
            for (const scopeGroup of scopes) {
              const entries = Object.values(scopeGroup);

              for (const item of entries) {
                const {
                  scope_id,
                  scope_name,
                  scope_category_id,
                  category_name,
                  group_id,
                  group_name,
                  segment_id,
                  segment_name,
                  site_id,
                  is_include,
                  pricePerSqft,
                  additional,
                  cost,
                  priceWithAdditional,
                  costSqft,
                  total,
                  condition,
                  notes,
                  optionPercentage,
                  budgetIndex,
                  budget_Cat_Id,
                } = item;

                const budgetBooksScope = await db.budgetBooksScopesObj.create({
                  budget_books_id: budgetBook.id,
                  is_include: is_include ?? null,
                  scope_id: scope_id,
                  title: scope_name || "",
                });

                const budgetBooksScopeCategory =
                  await db.budgetBooksScopeCategoriesObj.create({
                    budget_books_scope_id: budgetBooksScope.id,
                    scope_category_id: scope_category_id || null,
                    title: category_name || "",
                  });

                const budgetBooksScopeGroup =
                  await db.budgetBooksScopeGroupsObj.create({
                    budget_books_scope_category_id: budgetBooksScopeCategory.id,
                    scope_group_id: group_id || null,
                    title: group_name || "",
                  });

                await db.budgetBooksScopeSegmentsObj.create({
                  budget_books_scope_group_id: budgetBooksScopeGroup.id,
                  scope_sagment_id: segment_id,
                  title: segment_name || "",
                  notes: notes || "",
                  client_notes: null,
                  is_include: is_include ?? null,
                  acc: null,
                  internal_notes: null,
                  price_sqft: Number(pricePerSqft) || 0,
                  additionals: Number(additional) || 0,
                  price_w_additional: Number(priceWithAdditional) || 0,
                  budget_Cat_Id: budget_Cat_Id || null,
                  cost: Number(cost) || 0,
                  costSqft: Number(costSqft) || 0,
                  total: Number(total) || 0,
                  conditions: Array.isArray(condition)
                    ? condition.join(", ")
                    : condition || null,
                  site_id: site_id || null,
                  scopeId: scope_id || null,
                  optionPercentage: optionPercentage ?? null,
                  budgetIndex: budgetIndex ?? null,
                });
              }
            }
          }

          await Promise.all(promises);
        } catch (err) {}
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
      let { page = "1", per_page = "10", take_all = "" ,id} = req.query;

      page = parseInt(page) || 1;
      per_page = parseInt(per_page) || 10;

      take_all = take_all === "all";

      const { data: budgetBooks, meta } =
        await budgetBooksServices.getAllBudgetBooks({
          page,
          per_page,
          take_all,
          id
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

  // async updateBudgetBooks(req, res) {
  //   try {
  //     let data = req.body;
  //     let documentData = req.body;

  //     if (typeof data.form === "string") {
  //       try {
  //         data = JSON.parse(data.form);
  //       } catch (err) {
  //         return res.status(400).json({
  //           status: false,
  //           message: "Invalid JSON in 'form' field.",
  //         });
  //       }
  //     }

  //     const id = req.query.id;
  //     if (!id) {
  //       return res.status(400).json({
  //         status: false,
  //         message: "Missing budget book ID (id).",
  //       });
  //     }

  //     const postData = {
  //       user_id: req.userId || null,
  //       name: data.name || null,
  //       engineer_id: data.engineer_id || null,
  //       project_id: data.project_id || null,
  //       lead_id: data.lead_id || null,
  //       customer_id: data.customer_id || null,
  //       contact_id: data.contact_id || null,
  //       address: data.address || null,
  //       city: data.city || null,
  //       state: data.state || null,
  //       zip: data.zip || null,
  //       quote_date: data.quote_date || null,
  //       job_no: data.job_no || null,
  //       plan_date: data.plan_date || null,
  //       plan_status: data.plan_status || null,
  //       plan_info: data.plan_info || null,
  //       plan_note: data.plan_note || null,
  //       up_margin: data.up_margin || null,
  //       sp_margin: data.sp_margin || null,
  //       mc_margin: data.mc_margin || null,
  //       sw_margin: data.sw_margin || null,
  //       total_adders: data.total_adders || null,
  //       total_calculate: data.total_calculate || null,
  //       total: data.total || null,
  //       is_pricing: Boolean(data.is_pricing),
  //       is_budget_only: Boolean(data.is_budget_only),
  //       design: data.design || null,
  //       design_total: data.design_total || null,
  //       design_hr: data.design_hr || null,
  //       design_hrs: data.design_hrs || null,
  //       engineering: data.engineering || null,
  //       engineering_total: data.engineering_total || null,
  //       engineering_seal: data.engineering_seal || null,
  //       engineering_seals: data.engineering_seals || null,
  //       budget: data.budget || null,
  //       budget_total: data.budget_total || null,
  //       budget_hr: data.budget_hr || null,
  //       budget_hrs: data.budget_hrs || null,
  //       shipping: data.shipping || null,
  //       shipping_total: data.shipping_total || null,
  //       shipping_ship: data.shipping_ship || null,
  //       shipping_shipment: data.shipping_shipment || null,
  //       per_sqft: data.per_sqft || null,
  //       bldg_count: data.bldg_count || null,
  //       bldg_gsqft: data.bldg_gsqft || null,
  //       bldg_cost: data.bldg_cost || null,
  //       bldg_sqft: data.bldg_sqft || null,
  //       bldg_price: data.bldg_price || null,
  //       price: data.price || null,
  //       sw_tiedown: data.sw_tiedown || null,
  //       up_lift: data.up_lift || null,
  //       misc: data.misc || null,
  //       anchorage: data.anchorage || null,
  //       commission: data.commission || null,
  //       commission_rate: data.commission_rate || null,
  //       shipment_limit: data.shipment_limit || null,
  //       fill_in_limit: data.fill_in_limit || null,
  //       seal_limit: data.seal_limit || null,
  //       limit_notes: data.limit_notes || null,
  //       terms: data.terms || null,
  //       tax: data.tax || null,
  //       projectType: data.projectType || null,
  //       taxRate: data.taxRate || null,
  //       contact_email: data.contact_email || null,
  //     };

  //     const updatedBudgetBook = await budgetBooksServices.updateBudgetBooks(
  //       id,
  //       postData
  //     );

  //     const project = await projectServices.getProjectById(data.project_id);

  //     const saveFolder = async (module, module_id, drive_id, file_name) =>
  //       await projectServices.addDriveAssociation({
  //         parent: data.project_id,
  //         module,
  //         module_id,
  //         drive_id,
  //         file_name,
  //       });

  //     if (
  //       documentData.uploadDocumentDelete &&
  //       documentData.uploadDocumentDelete.length > 0
  //     ) {
  //       const idsToDelete = Array.isArray(documentData.uploadDocumentDelete)
  //         ? documentData.uploadDocumentDelete
  //         : JSON.parse(documentData.uploadDocumentDelete);

  //       for (const docId of idsToDelete) {
  //         const doc = await db.budgetBookDocumentsObj.findOne({
  //           where: { id: docId },
  //         });
  //         if (doc) {
  //           try {
  //             const driveId = doc.file_path?.includes("drive.google.com")
  //               ? doc.file_path.split("/d/")[1]?.split("/")[0]
  //               : null;

  //             if (driveId) {
  //               await db.gDriveAssociationObj.destroy({
  //                 where: { drive_id: driveId },
  //               });
  //             }
  //             await db.budgetBookDocumentsObj.destroy({ where: { id: docId } });
  //           } catch (delErr) {
  //             console.error(" Error deleting file:", delErr);
  //           }
  //         }
  //       }
  //     }

  //     if (Array.isArray(req.files) && req.files.length) {
  //       const budgetUploads = req.files.filter((f) =>
  //         f.fieldname.startsWith("uploadDocument")
  //       );

  //       if (budgetUploads.length) {
  //         const mainFolder = await getOrCreateSubfolder(
  //           process.env.GOOGLE_DRIVE_FOLDER_ID,
  //           `${data.project_id}. ${project.name}`
  //         );

  //         const budgetFolder = await getOrCreateSubfolder(
  //           mainFolder,
  //           "budgetFiles"
  //         );

  //         for (const [index, file] of budgetUploads.entries()) {
  //           const driveFile = await uploadFileToDrive(
  //             file.path,
  //             file.originalname,
  //             file.mimetype,
  //             budgetFolder
  //           );

  //           const uploadMeta = documentData.uploadDocument?.[index] || {};

  //           let doc = await db.budgetBookDocumentsObj.create({
  //             budget_book_id: id,
  //             file_name: file.originalname,
  //             notes: uploadMeta.note || null,
  //             type: uploadMeta.type || null,
  //             is_display: uploadMeta.displayToCustomer || null,
  //             file_path: driveFile.webViewLink,
  //           });
  //           await saveFolder(
  //             "budgetFiles",
  //             doc.id,
  //             driveFile.id,
  //             file.originalname
  //           );
  //         }
  //       }
  //     }

  //     const {
  //       budgetBooksScopeIncludes,
  //       budgetBooksDrawings,
  //       budgetBooksKeyAreas,
  //       budgetBooksContracts,
  //       sites,
  //       budgets,
  //       sitePlan,
  //       scopeOther,
  //       sitePlan2,
  //       veOptions,
  //       optionPackages,
  //       scopes,
  //     } = data;

  //     await budgetBooksServices.replaceAssociations(id, {
  //       budgetBooksScopeIncludes,
  //       budgetBooksDrawings,
  //       budgetBooksKeyAreas,
  //       budgetBooksContracts,
  //       sites,
  //       budgets,
  //       sitePlan,
  //       scopeOther,
  //       sitePlan2,
  //       veOptions,
  //       optionPackages,
  //       scopes,
  //     });

  //     return res
  //       .status(200)
  //       .json(
  //         commonHelper.parseSuccessRespose(
  //           updatedBudgetBook,
  //           "Budget Book and related project data updated successfully."
  //         )
  //       );
  //   } catch (error) {
  //     logger.errorLog.log("error", commonHelper.customizeCatchMsg(error));
  //     return res.status(500).json({
  //       status: false,
  //       message: error.message || "Budget Book update failed",
  //       data: {},
  //     });
  //   }
  // },

  async updateBudgetBooks(req, res) {
    try {
      let data = req.body;
      let documentData = req.body;

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

      const id = req.query.id;
      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Missing budget book ID (id).",
        });
      }

      // if (data.updateType === "new_version") {
      //   const record = await db.budgetBooksObj.findOne({
      //     where: { id },
      //     include: [
      //       // 🔹 Related Project
      //       { model: db.projectObj, as: "budgetProject", required: false },

      //       // 🔹 Site Plans
      //       {
      //         model: db.sitePlansObj,
      //         as: "sitePlan",
      //         required: false,
      //         separate: true,
      //         include: [
      //           {
      //             model: db.budgetBookOthersObj,
      //             as: "budgetBookOthers",
      //             required: false,
      //           },
      //         ],
      //       },

      //       // 🔹 Lead + Project
      //       {
      //         model: db.leadsObj,
      //         as: "budgetLead",
      //         required: false,
      //         include: [
      //           { model: db.projectObj, as: "project", required: false },
      //         ],
      //       },

      //       // 🔹 Budgets
      //       {
      //         model: db.projectBudgetsObj,
      //         as: "budgets",
      //         required: false,
      //         separate: true,
      //       },

      //       // 🔹 Site Plan Items
      //       {
      //         model: db.sitePlanItemsObj,
      //         as: "sitePlan2",
      //         required: false,
      //         separate: true,
      //       },

      //       // 🔹 Documents
      //       {
      //         model: db.budgetBookDocumentsObj,
      //         as: "budgetBookDocuments",
      //         required: false,
      //         separate: true,
      //       },

      //       // 🔹 Sites
      //       {
      //         model: db.budgetBooksSitesObj,
      //         as: "sites",
      //         required: false,
      //         separate: true,
      //       },

      //       // 🔹 VE Options
      //       {
      //         model: db.veOptionsObj,
      //         as: "veOptions",
      //         required: false,
      //         separate: true,
      //       },

      //       // 🔹 Option Packages
      //       {
      //         model: db.optionPackageObj,
      //         as: "optionPackages",
      //         required: false,
      //         separate: true,
      //       },

      //       // 🔹 Scope Includes
      //       {
      //         model: db.budgetBooksScopeIncludesObj,
      //         as: "budgetBooksScopeIncludes",
      //         required: false,
      //         separate: true,
      //       },

      //       // 🔹 Contracts + Components
      //       {
      //         model: db.budgetBooksContractsObj,
      //         as: "budgetBooksContracts",
      //         required: false,
      //         separate: true,
      //         include: [
      //           {
      //             model: db.contractComponentsObj,
      //             as: "contractComponents",
      //             required: false,
      //           },
      //         ],
      //       },

      //       // 🔹 Key Areas
      //       {
      //         model: db.budgetBooksKeyAreasObj,
      //         as: "budgetBooksKeyAreas",
      //         required: false,
      //         separate: true,
      //         include: [
      //           {
      //             model: db.budgetKeyAreasObj,
      //             as: "budgetKeyAreas",
      //             required: false,
      //           },
      //         ],
      //       },

      //       // 🔹 Drawings + Submittals
      //       {
      //         model: db.budgetBooksDrawingsObj,
      //         as: "budgetBooksDrawings",
      //         required: false,
      //         separate: true,
      //         include: [
      //           {
      //             model: db.submittalsObj,
      //             as: "submittals",
      //             required: false,
      //           },
      //         ],
      //       },

      //       // 🔹 Scopes Hierarchy
      //       {
      //         model: db.budgetBooksScopesObj,
      //         as: "projectScopes",
      //         required: false,
      //         separate: true,
      //         include: [
      //           { model: db.budgetScopeObj, as: "scope", required: false },
      //           {
      //             model: db.budgetBooksScopeCategoriesObj,
      //             as: "categories",
      //             required: false,
      //             include: [
      //               {
      //                 model: db.scopeCategoryObj,
      //                 as: "scopeCategory",
      //                 required: false,
      //               },
      //               {
      //                 model: db.budgetBooksScopeGroupsObj,
      //                 as: "groups",
      //                 required: false,
      //                 include: [
      //                   {
      //                     model: db.scopeGroupObj,
      //                     as: "scopeGroup",
      //                     required: false,
      //                   },
      //                   {
      //                     model: db.budgetBooksScopeSegmentsObj,
      //                     as: "segments",
      //                     required: false,
      //                     include: [
      //                       {
      //                         model: db.scopeSegmentObj,
      //                         as: "scopeSagment",
      //                         required: false,
      //                       },
      //                     ],
      //                   },
      //                 ],
      //               },
      //             ],
      //           },
      //         ],
      //       },
      //     ],
      //   });

      //   const recordJson = record.toJSON();

      //   const snapshot = {
      //     ...(recordJson.budgets?.length
      //       ? { budgets: recordJson.budgets }
      //       : {}),
      //     ...(recordJson.sitePlan?.length
      //       ? { sitePlan: recordJson.sitePlan }
      //       : {}),
      //     ...(recordJson.sitePlan2?.length
      //       ? { sitePlan2: recordJson.sitePlan2 }
      //       : {}),
      //     ...(recordJson.sites?.length ? { sites: recordJson.sites } : {}),
      //     ...(recordJson.veOptions?.length
      //       ? { veOptions: recordJson.veOptions }
      //       : {}),
      //     ...(recordJson.optionPackages?.length
      //       ? { optionPackages: recordJson.optionPackages }
      //       : {}),
      //     ...(recordJson.budgetBooksContracts?.length
      //       ? { budgetBooksContracts: recordJson.budgetBooksContracts }
      //       : {}),
      //     ...(recordJson.budgetBooksScopeIncludes?.length
      //       ? {
      //           budgetBooksScopeIncludes: recordJson.budgetBooksScopeIncludes,
      //         }
      //       : {}),
      //     ...(recordJson.budgetBooksKeyAreas?.length
      //       ? { budgetBooksKeyAreas: recordJson.budgetBooksKeyAreas }
      //       : {}),
      //     ...(recordJson.budgetBooksDrawings?.length
      //       ? { budgetBooksDrawings: recordJson.budgetBooksDrawings }
      //       : {}),
      //     ...(recordJson.projectScopes?.length
      //       ? { projectScopes: recordJson.projectScopes }
      //       : {}),
      //     ...(recordJson.budgetBookDocuments?.length
      //       ? { budgetBookDocuments: recordJson.budgetBookDocuments }
      //       : {}),
      //   };

      //   let logData;
      //   const logType = db.budgetHistoryObj.rawAttributes?.log?.type?.key;

      //   if (["STRING", "TEXT"].includes(logType)) {
      //     logData = JSON.stringify(snapshot);
      //   } else {
      //     logData = snapshot;
      //   }

      //   await db.budgetHistoryObj.create({
      //     budget_book_id: id,
      //     project_id: data.project_id,
      //     revision_status: record.revision_status || "0",
      //     log: logData,
      //     changed_by: req.userId || null,
      //   });
      // }
      if (data.updateType === "new_version") {
        const record = await db.budgetBooksObj.findOne({
          where: { id },
          include: [
            // 🔹 Related Project
            { model: db.projectObj, as: "budgetProject", required: false },

            // 🔹 Site Plans
            {
              model: db.sitePlansObj,
              as: "sitePlan",
              required: false,
              separate: true,
              include: [
                {
                  model: db.budgetBookOthersObj,
                  as: "budgetBookOthers",
                  required: false,
                },
              ],
            },

            // 🔹 Lead + Project
            {
              model: db.leadsObj,
              as: "budgetLead",
              required: false,
              include: [
                { model: db.projectObj, as: "project", required: false },
              ],
            },

            // 🔹 Budgets
            {
              model: db.projectBudgetsObj,
              as: "budgets",
              required: false,
              separate: true,
            },

            // 🔹 Site Plan Items
            {
              model: db.sitePlanItemsObj,
              as: "sitePlan2",
              required: false,
              separate: true,
            },

            // 🔹 Documents
            {
              model: db.budgetBookDocumentsObj,
              as: "budgetBookDocuments",
              required: false,
              separate: true,
            },

            // 🔹 Sites
            {
              model: db.budgetBooksSitesObj,
              as: "sites",
              required: false,
              separate: true,
            },

            // 🔹 VE Options
            {
              model: db.veOptionsObj,
              as: "veOptions",
              required: false,
              separate: true,
            },

            // 🔹 Option Packages
            {
              model: db.optionPackageObj,
              as: "optionPackages",
              required: false,
              separate: true,
            },

            // 🔹 Scope Includes
            {
              model: db.budgetBooksScopeIncludesObj,
              as: "budgetBooksScopeIncludes",
              required: false,
              separate: true,
            },

            // 🔹 Contracts + Components
            {
              model: db.budgetBooksContractsObj,
              as: "budgetBooksContracts",
              required: false,
              separate: true,
              include: [
                {
                  model: db.contractComponentsObj,
                  as: "contractComponents",
                  required: false,
                },
              ],
            },

            // 🔹 Key Areas
            {
              model: db.budgetBooksKeyAreasObj,
              as: "budgetBooksKeyAreas",
              required: false,
              separate: true,
              include: [
                {
                  model: db.budgetKeyAreasObj,
                  as: "budgetKeyAreas",
                  required: false,
                },
              ],
            },

            // 🔹 Drawings + Submittals
            {
              model: db.budgetBooksDrawingsObj,
              as: "budgetBooksDrawings",
              required: false,
              separate: true,
              include: [
                {
                  model: db.submittalsObj,
                  as: "submittals",
                  required: false,
                },
              ],
            },

            // 🔹 Scopes Hierarchy
            {
              model: db.budgetBooksScopesObj,
              as: "projectScopes",
              required: false,
              separate: true,
              include: [
                { model: db.budgetScopeObj, as: "scope", required: false },
                {
                  model: db.budgetBooksScopeCategoriesObj,
                  as: "categories",
                  required: false,
                  include: [
                    {
                      model: db.scopeCategoryObj,
                      as: "scopeCategory",
                      required: false,
                    },
                    {
                      model: db.budgetBooksScopeGroupsObj,
                      as: "groups",
                      required: false,
                      include: [
                        {
                          model: db.scopeGroupObj,
                          as: "scopeGroup",
                          required: false,
                        },
                        {
                          model: db.budgetBooksScopeSegmentsObj,
                          as: "segments",
                          required: false,
                          include: [
                            {
                              model: db.scopeSegmentObj,
                              as: "scopeSagment",
                              required: false,
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        });

        // 🔹 Convert to plain JSON
        const recordJson = record.toJSON();

        // 🔹 Build snapshot structure (skip empty arrays)
        const snapshot = {
          ...(recordJson.budgets?.length
            ? { budgets: recordJson.budgets }
            : {}),
          ...(recordJson.sitePlan?.length
            ? { sitePlan: recordJson.sitePlan }
            : {}),
          ...(recordJson.sitePlan2?.length
            ? { sitePlan2: recordJson.sitePlan2 }
            : {}),
          ...(recordJson.sites?.length ? { sites: recordJson.sites } : {}),
          ...(recordJson.veOptions?.length
            ? { veOptions: recordJson.veOptions }
            : {}),
          ...(recordJson.optionPackages?.length
            ? { optionPackages: recordJson.optionPackages }
            : {}),
          ...(recordJson.budgetBooksContracts?.length
            ? { budgetBooksContracts: recordJson.budgetBooksContracts }
            : {}),
          ...(recordJson.budgetBooksScopeIncludes?.length
            ? { budgetBooksScopeIncludes: recordJson.budgetBooksScopeIncludes }
            : {}),
          ...(recordJson.budgetBooksKeyAreas?.length
            ? { budgetBooksKeyAreas: recordJson.budgetBooksKeyAreas }
            : {}),
          ...(recordJson.budgetBooksDrawings?.length
            ? { budgetBooksDrawings: recordJson.budgetBooksDrawings }
            : {}),
          ...(recordJson.projectScopes?.length
            ? { projectScopes: recordJson.projectScopes }
            : {}),
          ...(recordJson.budgetBookDocuments?.length
            ? { budgetBookDocuments: recordJson.budgetBookDocuments }
            : {}),
        };

        // 🔹 Handle JSON column vs TEXT column
        const logType = db.budgetHistoryObj.rawAttributes?.log?.type?.key;
        const logData =
          ["STRING", "TEXT"].includes(logType) || typeof logType === "undefined"
            ? JSON.stringify(snapshot)
            : snapshot;

        // 🔹 Create snapshot entry
        await db.budgetHistoryObj.create({
          budget_book_id: id,
          project_id: data.project_id || recordJson?.budgetProject?.id || null,
          revision_status: record.revision_status || "0",
          log: logData,
          changed_by: req.userId || null,
        });

        console.log("✅ New version snapshot created successfully.");
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
        taxRate: data.taxRate || null,
        contact_email: data.contact_email || null,
      };

      const updatedBudgetBook = await budgetBooksServices.updateBudgetBooks(
        id,
        postData
      );

      const project = await projectServices.getProjectById(data.project_id);

      const saveFolder = async (module, module_id, drive_id, file_name) =>
        await projectServices.addDriveAssociation({
          parent: data.project_id,
          module,
          module_id,
          drive_id,
          file_name,
        });

      if (
        documentData.uploadDocumentDelete &&
        documentData.uploadDocumentDelete.length > 0
      ) {
        const idsToDelete = Array.isArray(documentData.uploadDocumentDelete)
          ? documentData.uploadDocumentDelete
          : JSON.parse(documentData.uploadDocumentDelete);

        for (const docId of idsToDelete) {
          const doc = await db.budgetBookDocumentsObj.findOne({
            where: { id: docId },
          });
          if (doc) {
            try {
              const driveId = doc.file_path?.includes("drive.google.com")
                ? doc.file_path.split("/d/")[1]?.split("/")[0]
                : null;

              if (driveId) {
                await db.gDriveAssociationObj.destroy({
                  where: { drive_id: driveId },
                });
              }
              await db.budgetBookDocumentsObj.destroy({ where: { id: docId } });
            } catch (delErr) {
              console.error(" Error deleting file:", delErr);
            }
          }
        }
      }

      if (Array.isArray(req.files) && req.files.length) {
        const budgetUploads = req.files.filter((f) =>
          f.fieldname.startsWith("uploadDocument")
        );

        if (budgetUploads.length) {
          const mainFolder = await getOrCreateSubfolder(
            process.env.GOOGLE_DRIVE_FOLDER_ID,
            `${data.project_id}. ${project.name}`
          );

          const budgetFolder = await getOrCreateSubfolder(
            mainFolder,
            "budgetFiles"
          );

          for (const [index, file] of budgetUploads.entries()) {
            const driveFile = await uploadFileToDrive(
              file.path,
              file.originalname,
              file.mimetype,
              budgetFolder
            );

            const uploadMeta = documentData.uploadDocument?.[index] || {};

            let doc = await db.budgetBookDocumentsObj.create({
              budget_book_id: id,
              file_name: file.originalname,
              notes: uploadMeta.note || null,
              type: uploadMeta.type || null,
              is_display: uploadMeta.displayToCustomer || null,
              file_path: driveFile.webViewLink,
            });
            await saveFolder(
              "budgetFiles",
              doc.id,
              driveFile.id,
              file.originalname
            );
          }
        }
      }

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

      await budgetBooksServices.replaceAssociations(id, {
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
  async budgetDocumentDelete(req, res) {
    try {
      const { id } = req.params;

      const result = await budgetBooksServices.deleteBudgetDocument(id);

      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.message || "Document not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Document deleted successfully",
      });
    } catch (error) {
      console.error("Error in budgetDocumentDelete:", error);
      return res.status(500).json({
        success: false,
        message: "Server error while deleting document",
      });
    }
  },

  async getAllBudgetBooksHistory(req, res) {
    try {
      const { budgetId, page = 1, per_page = 10 } = req.query;

      if (!budgetId) {
        return res
          .status(400)
          .json(commonHelper.errorResponse("budget_book_id is required"));
      }

      const result = await budgetBooksServices.getAllBudgetBooksHistory(
        budgetId,
        page,
        per_page
      );

      return res.status(200).json({
        success: true,
        message: "Budget book history fetched successfully",
        data: result.rows,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error("Error in getAllBudgetBooksHistory:", error);
      return res.status(500).json(commonHelper.errorResponse(error.message));
    }
  },
  // async getBudgetBySegment(req, res) {
  //   // try {
  //   //   const engineer_id = req.query.engineer_id;
  //   //   const scope_id = req.query.scope_id;
  //   //   const sagment_id = req.query.sagment_id;
  //   //   const current_project = req.query.current_project;

  //   //   if (!engineer_id || !scope_id || !sagment_id) {
  //   //     return res.status(400).json({
  //   //       message:
  //   //         "engineer_id, scope_id & sagment_id parameters are required.",
  //   //     });
  //   //   }

  //   //   const budgetBooks = await db.budgetBooksObj.findAll({
  //   //     where: {
  //   //       engineer_id,
  //   //       ...(current_project ? { id: { [Op.ne]: current_project } } : {}),
  //   //     },
  //   //     include: [
  //   //       {
  //   //         model: db.projectObj,
  //   //         as: "budgetProject",
  //   //         required: false,
  //   //       },
  //   //       {
  //   //         model: db.companyObj,
  //   //         as: "engineer",
  //   //         required: false,
  //   //       },
  //   //       {
  //   //         model: db.budgetBooksScopesObj,
  //   //         as: "projectScopes",
  //   //         required: true,
  //   //         where: { scope_id },
  //   //         include: [
  //   //           {
  //   //             model: db.budgetBooksScopeCategoriesObj,
  //   //             as: "categories",
  //   //             required: true,
  //   //             include: [
  //   //               {
  //   //                 model: db.budgetBooksScopeGroupsObj,
  //   //                 as: "groups",
  //   //                 required: true,
  //   //                 include: [
  //   //                   {
  //   //                     model: db.budgetBooksScopeSegmentsObj,
  //   //                     as: "segments",
  //   //                     required: true,
  //   //                     where: { scope_sagment_id: sagment_id },
  //   //                   },
  //   //                 ],
  //   //               },
  //   //             ],
  //   //           },
  //   //         ],
  //   //       },
  //   //     ],
  //   //   });

  //   //   const formatted = [];

  //   //   for (const budgetBook of budgetBooks) {
  //   //     const b = budgetBook.toJSON();

  //   //     if (Array.isArray(b.projectScopes)) {
  //   //       for (const scope of b.projectScopes) {
  //   //         if (Array.isArray(scope.categories)) {
  //   //           for (const category of scope.categories) {
  //   //             if (Array.isArray(category.groups)) {
  //   //               for (const group of category.groups) {
  //   //                 if (Array.isArray(group.segments)) {
  //   //                   for (const segment of group.segments) {
  //   //                     formatted.push({
  //   //                       projectName: b.budgetProject?.name || "N/A",
  //   //                       engineer: b.engineer?.name || "N/A",
  //   //                       scopeTitle: scope.title || "N/A",
  //   //                       categoryTitle: category.title || "N/A",
  //   //                       groupTitle: group.title || "N/A",
  //   //                       segmentTitle: segment.title || "N/A",
  //   //                       cost: `$${Number(segment.cost || 0).toFixed(2)}`,
  //   //                       sqft: Number(b.bldg_sqft || 0),
  //   //                       option: segment.is_include ?? "N/A",
  //   //                       condition: segment.conditions ?? "N/A",
  //   //                       notes: segment.notes ?? "N/A",
  //   //                       total: Number(segment.total || 0),
  //   //                       optionPercentage: segment.optionPercentage ?? "N/A",
  //   //                       site_id: segment.site_id || null,
  //   //                     });
  //   //                   }
  //   //                 }
  //   //               }
  //   //             }
  //   //           }
  //   //         }
  //   //       }
  //   //     }
  //   //   }

  //   //   return res.status(200).json({
  //   //     status: true,
  //   //     message: "Budget data fetched successfully",
  //   //     total: formatted.length,
  //   //     data: formatted,
  //   //   });
  //   // } catch (error) {
  //   //   console.error("Error fetching budget segment data:", error);
  //   //   return res.status(500).json({
  //   //     message: "Internal server error while fetching budget segment data.",
  //   //     error: error.message,
  //   //   });
  //   // }

  //   try {
  //     const engineer_id = req.query.engineer_id;
  //     const scope_id = req.query.scope_id;
  //     const sagment_id = req.query.sagment_id;
  //     const current_project = req.query.current_project;

  //     const page = parseInt(req.query.page) || 1;
  //     const per_page = parseInt(req.query.per_page) || 10;
  //     const offset = (page - 1) * per_page;

  //     if (!engineer_id || !scope_id || !sagment_id) {
  //       return res.status(400).json({
  //         status: false,
  //         message:
  //           "engineer_id, scope_id & sagment_id parameters are required.",
  //       });
  //     }

  //     const { count, rows: budgetBooks } =
  //       await db.budgetBooksObj.findAndCountAll({
  //         where: {
  //           engineer_id,
  //           ...(current_project ? { id: { [Op.ne]: current_project } } : {}),
  //         },
  //         include: [
  //           {
  //             model: db.projectObj,
  //             as: "budgetProject",
  //             required: false,
  //           },
  //           {
  //             model: db.companyObj,
  //             as: "engineer",
  //             required: false,
  //           },
  //           {
  //             model: db.budgetBooksScopesObj,
  //             as: "projectScopes",
  //             required: true,
  //             where: { scope_id },
  //             include: [
  //               {
  //                 model: db.budgetBooksScopeCategoriesObj,
  //                 as: "categories",
  //                 required: true,
  //                 include: [
  //                   {
  //                     model: db.budgetBooksScopeGroupsObj,
  //                     as: "groups",
  //                     required: true,
  //                     include: [
  //                       {
  //                         model: db.budgetBooksScopeSegmentsObj,
  //                         as: "segments",
  //                         required: true,
  //                         where: { scope_sagment_id: sagment_id },
  //                       },
  //                     ],
  //                   },
  //                 ],
  //               },
  //             ],
  //           },
  //         ],
  //         limit: per_page,
  //         offset,
  //         distinct: true,
  //       });

  //     const formatted = [];

  //     for (const budgetBook of budgetBooks) {
  //       const b = budgetBook.toJSON();

  //       if (Array.isArray(b.projectScopes)) {
  //         for (const scope of b.projectScopes) {
  //           if (Array.isArray(scope.categories)) {
  //             for (const category of scope.categories) {
  //               if (Array.isArray(category.groups)) {
  //                 for (const group of category.groups) {
  //                   if (Array.isArray(group.segments)) {
  //                     for (const segment of group.segments) {
  //                       formatted.push({
  //                         projectName: b.budgetProject?.name || "N/A",
  //                         engineer: b.engineer?.name || "N/A",
  //                         scopeTitle: scope.title || "N/A",
  //                         categoryTitle: category.title || "N/A",
  //                         groupTitle: group.title || "N/A",
  //                         segmentTitle: segment.title || "N/A",
  //                         cost: `$${Number(segment.cost || 0).toFixed(2)}`,
  //                         sqft: Number(b.bldg_sqft || 0),
  //                         option: segment.is_include ?? "N/A",
  //                         condition: segment.conditions ?? "N/A",
  //                         notes: segment.notes ?? "N/A",
  //                         total: Number(segment.total || 0),
  //                         optionPercentage: segment.optionPercentage ?? "N/A",
  //                         site_id: segment.site_id || null,
  //                       });
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }

  //     const last_page = Math.ceil(count / per_page);
  //     const from = offset + 1;
  //     const to = Math.min(offset + per_page, count);

  //     return res.status(200).json({
  //       status: true,
  //       message: "Budget data fetched successfully",
  //       data: formatted,
  //       meta: {
  //         current_page: page,
  //         from: count === 0 ? 0 : from,
  //         last_page,
  //         per_page,
  //         to: count === 0 ? 0 : to,
  //         total: count,
  //       },
  //     });
  //   } catch (error) {
  //     console.error("Error fetching budget segment data:", error);
  //     return res.status(500).json({
  //       status: false,
  //       message: "Internal server error while fetching budget segment data.",
  //       error: error.message,
  //     });
  //   }
  // },
  async getBudgetBySegment(req, res) {
    try {
      const { engineer_id, scope_id, sagment_id, current_project } = req.query;
      const page = parseInt(req.query.page) || 1;
      const per_page = parseInt(req.query.per_page) || 10;

      if (!engineer_id || !scope_id || !sagment_id) {
        return res.status(400).json({
          status: false,
          message:
            "engineer_id, scope_id & sagment_id parameters are required.",
        });
      }

      const result = await budgetBooksServices.getBudgetBySegment({
        engineer_id,
        scope_id,
        sagment_id,
        current_project,
        page,
        per_page,
      });

      return res.status(200).json({
        status: true,
        message: "Budget data fetched successfully",
        ...result,
      });
    } catch (error) {
      console.error("Error fetching budget segment data:", error);
      return res.status(500).json({
        status: false,
        message: "Internal server error while fetching budget segment data.",
        error: error.message,
      });
    }
  },
};
