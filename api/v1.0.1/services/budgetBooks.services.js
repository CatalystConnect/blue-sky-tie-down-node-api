var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op, Sequelize } = require("sequelize");
const slugify = require("slugify");

module.exports = {
  /*addBudgetBooks*/
  async addBudgetBooks(postData) {
    try {
      const budgetBook = await db.budgetBooksObj.create(postData);

      return budgetBook;
    } catch (error) {
      console.log("DB Insert Error:", error);
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(error));
      throw error;
    }
  },
  async getAllBudgetBooks(query) {
    try {
      let { page = 1, per_page = 10, take_all = false } = query;
      page = parseInt(page) || 1;
      per_page = parseInt(per_page) || 10;
      const offset = (page - 1) * per_page;

      // -------------------------
      // Define reusable include
      // -------------------------
      const budgetBookIncludes = [
        {
          model: db.companyObj,
          as: "engineer",
          attributes: ["id", "name"],
          required: false,
        },
        {
          model: db.projectObj,
          as: "budgetProject",
          attributes: ["id", "name"],
          required: false,
        },
        {
          model: db.leadsObj,
          as: "budgetLead",
          required: false,
          include: [
            {
              model: db.projectObj,
              as: "project",
              attributes: ["id", "name"],
              required: false,
            },
            {
              model: db.leadTeamsMemberObj,
              as: "leadTeamMembers",
              required: false,
              separate: true,
            },
          ],
        },
        {
          model: db.budgetBooksScopeIncludesObj,
          as: "budgetBooksScopeIncludes",
          required: false,
          separate: true,
        },
        {
          model: db.budgetBooksDrawingsObj,
          as: "budgetBooksDrawings",
          required: false,
          separate: true,
        },
        {
          model: db.budgetBooksKeyAreasObj,
          as: "budgetBooksKeyAreas",
          required: false,
          separate: true,
        },
        {
          model: db.budgetBooksContractsObj,
          as: "budgetBooksContracts",
          required: false,
          separate: true,
        },
        {
          model: db.sitePlansObj,
          as: "sitePlan",
          required: false,
          separate: true,
        },
        {
          model: db.sitePlanItemsObj,
          as: "sitePlan2",
          required: false,
          separate: true,
        },
        {
          model: db.projectBudgetsObj,
          as: "budgets",
          required: false,
          separate: true,
        },
        {
          model: db.budgetBooksSitesObj,
          as: "sites",
          required: false,
          separate: true,
        },
        {
          model: db.budgetBooksScopesObj,
          as: "projectScopes",
          required: false,
          separate: true,
          include: [
            {
              model: db.budgetScopeObj,
              as: "scope",
              required: false,
              include: [
                {
                  model: db.budgetCategoryObj,
                  as: "budgetCategory",
                  required: false,
                },
              ],
            },
            {
              model: db.budgetBooksScopeCategoriesObj,
              as: "categories",
              required: false,
              separate: true,
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
                  separate: true,
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
                      separate: true,
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
        {
          model: db.budgetBookDocumentsObj,
          as: "budgetBookDocuments",
        }
      ];

      // -------------------------
      // Fetch budgetBooks
      // -------------------------
      const budgetBooks = await db.budgetBooksObj.findAll({
        limit: take_all ? undefined : per_page,
        offset: take_all ? undefined : offset,
        order: [["created_at", "DESC"]],
        include: budgetBookIncludes,
      });

      // Total count for pagination
      const total = await db.budgetBooksObj.count();

      // -------------------------
      // Pagination meta
      // -------------------------
      const last_page = Math.ceil(total / per_page);
      const from = total > 0 ? offset + 1 : 0;
      const to = Math.min(offset + per_page, total);

      // -------------------------
      // Optional: Normalize data to guarantee null for missing relations
      // -------------------------
      const normalizeBudgetBooks = (items) =>
        items.map((b) => {
          const data = b.toJSON();
          data.budgetLead = data.budgetLead || null;
          data.budgetProject = data.budgetProject || null;
          data.engineer = data.engineer || null;

          data.projectScopes =
            data.projectScopes?.map((scope) => {
              scope.categories =
                scope.categories?.map((cat) => {
                  cat.groups =
                    cat.groups?.map((group) => {
                      group.segments = group.segments || [];
                      return group;
                    }) || [];
                  return cat;
                }) || [];
              return scope;
            }) || [];

          return data;
        });

      return {
        data: normalizeBudgetBooks(budgetBooks),
        meta: {
          current_page: page,
          from,
          last_page,
          per_page: take_all ? total : per_page,
          to: take_all ? total : to,
          total,
        },
      };
    } catch (error) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(error));
      throw error;
    }
  },

  // async getAllBudgetBooks(query) {
  //   try {
  //     let { page = 1, per_page = 10, take_all = false } = query;
  //     page = parseInt(page) || 1;
  //     per_page = parseInt(per_page) || 10;

  //     if (take_all) {
  //       // Fetch all records
  //       const allRecords = await db.budgetBooksObj.findAll({
  //         order: [["created_at", "DESC"]],
  //         include: [
  //           { model: db.companyObj, as: "engineer", required: false },
  //           { model: db.projectObj, as: "budgetProject", required: false },
  //           {
  //             model: db.leadsObj,
  //             as: "budgetLead",
  //             required: false,
  //             include: [
  //               { model: db.projectObj, as: "project", required: false },
  //               {
  //                 model: db.leadTeamsMemberObj,
  //                 as: "leadTeamMembers",
  //                 required: false,
  //                 separate: true,
  //               },
  //             ],
  //           },
  //           {
  //             model: db.budgetBooksScopeIncludesObj,
  //             as: "budgetBooksScopeIncludes",
  //             required: false,
  //             separate: true,
  //           },
  //           {
  //             model: db.budgetBooksDrawingsObj,
  //             as: "budgetBooksDrawings",
  //             required: false,
  //             separate: true,
  //           },
  //           {
  //             model: db.budgetBooksKeyAreasObj,
  //             as: "budgetBooksKeyAreas",
  //             required: false,
  //             separate: true,
  //           },
  //           {
  //             model: db.budgetBooksContractsObj,
  //             as: "budgetBooksContracts",
  //             required: false,
  //             separate: true,
  //           },
  //           {
  //             model: db.sitePlansObj,
  //             as: "sitePlan",
  //             required: false,
  //             separate: true,
  //           },
  //           {
  //             model: db.sitePlanItemsObj,
  //             as: "sitePlan2",
  //             required: false,
  //             separate: true,
  //           },
  //           {
  //             model: db.projectBudgetsObj,
  //             as: "budgets",
  //             required: false,
  //             separate: true,
  //           },
  //           {
  //             model: db.budgetBooksSitesObj,
  //             as: "sites",
  //             required: false,
  //             separate: true,
  //           },
  //           {
  //             model: db.budgetBooksScopesObj,
  //             as: "projectScopes",
  //             required: false,
  //             include: [
  //               {
  //                 model: db.budgetBooksScopeCategoriesObj,
  //                 as: "categories",
  //                 required: false,
  //                 include: [
  //                   {
  //                     model: db.budgetBooksScopeGroupsObj,
  //                     as: "groups",
  //                     required: false,
  //                     include: [
  //                       {
  //                         model: db.budgetBooksScopeSegmentsObj,
  //                         as: "segments",
  //                         required: false,
  //                         include: [
  //                           {
  //                             model: db.scopeSegmentObj,
  //                             as: "scopeSagment",
  //                             required: false,
  //                           },
  //                         ],
  //                         separate: true,
  //                       },
  //                     ],
  //                     separate: true,
  //                   },
  //                 ],
  //                 separate: true,
  //               },
  //             ],
  //             separate: true,
  //           },
  //         ],
  //       });

  //       return {
  //         data: allRecords,
  //         meta: {
  //           current_page: 1,
  //           from: 1,
  //           last_page: 1,
  //           per_page: allRecords.length,
  //           to: allRecords.length,
  //           total: allRecords.length,
  //         },
  //       };
  //     }

  //     // Pagination logic
  //     const offset = (page - 1) * per_page;
  //     const total = await db.budgetBooksObj.count();

  //     const budgetBooks = await db.budgetBooksObj.findAll({
  //       limit: per_page,
  //       offset,
  //       order: [["created_at", "DESC"]],
  //       include: [
  //         { model: db.companyObj, as: "engineer", required: false },
  //         { model: db.projectObj, as: "budgetProject", required: false },
  //         {
  //           model: db.leadsObj,
  //           as: "budgetLead",
  //           required: false,
  //           include: [
  //             { model: db.projectObj, as: "project", required: false },
  //             {
  //               model: db.leadTeamsMemberObj,
  //               as: "leadTeamMembers",
  //               required: false,
  //               separate: true,
  //             },
  //           ],
  //         },
  //         {
  //           model: db.budgetBooksScopeIncludesObj,
  //           as: "budgetBooksScopeIncludes",
  //           required: false,
  //           separate: true,
  //         },
  //         {
  //           model: db.budgetBooksDrawingsObj,
  //           as: "budgetBooksDrawings",
  //           required: false,
  //           separate: true,
  //         },
  //         {
  //           model: db.budgetBooksKeyAreasObj,
  //           as: "budgetBooksKeyAreas",
  //           required: false,
  //           separate: true,
  //         },
  //         {
  //           model: db.budgetBooksContractsObj,
  //           as: "budgetBooksContracts",
  //           required: false,
  //           separate: true,
  //         },
  //         {
  //           model: db.sitePlansObj,
  //           as: "sitePlan",
  //           required: false,
  //           separate: true,
  //         },
  //         {
  //           model: db.sitePlanItemsObj,
  //           as: "sitePlan2",
  //           required: false,
  //           separate: true,
  //         },
  //         {
  //           model: db.projectBudgetsObj,
  //           as: "budgets",
  //           required: false,
  //           separate: true,
  //         },
  //         {
  //           model: db.budgetBooksSitesObj,
  //           as: "sites",
  //           required: false,
  //           separate: true,
  //         },
  //         {
  //           model: db.budgetBooksScopesObj,
  //           as: "projectScopes",
  //           required: false,
  //           include: [
  //             {
  //               model: db.budgetBooksScopeCategoriesObj,
  //               as: "categories",
  //               required: false,
  //               include: [
  //                 {
  //                   model: db.budgetBooksScopeGroupsObj,
  //                   as: "groups",
  //                   required: false,
  //                   include: [
  //                     {
  //                       model: db.budgetBooksScopeSegmentsObj,
  //                       as: "segments",
  //                       required: false,
  //                       include: [
  //                         {
  //                           model: db.scopeSegmentObj,
  //                           as: "scopeSagment",
  //                           required: false,
  //                         },
  //                       ],
  //                       separate: true,
  //                     },
  //                   ],
  //                   separate: true,
  //                 },
  //               ],
  //               separate: true,
  //             },
  //           ],
  //           separate: true,
  //         },
  //       ],
  //     });

  //     const last_page = Math.ceil(total / per_page);
  //     const from = total > 0 ? offset + 1 : 0;
  //     const to = Math.min(offset + per_page, total);

  //     return {
  //       data: budgetBooks,
  //       meta: {
  //         current_page: page,
  //         from,
  //         last_page,
  //         per_page,
  //         to,
  //         total,
  //       },
  //     };
  //   } catch (error) {
  //     logger.errorLog.log("error", commonHelper.customizeCatchMsg(error));
  //     throw error;
  //   }
  // },

  async getBudgetBooksById(budgetBooksId) {
    try {
      const budgetBook = await db.budgetBooksObj.findOne({
        where: { id: budgetBooksId },
        include: [
          { model: db.companyObj, as: "engineer", required: false },
          { model: db.projectObj, as: "budgetProject", required: false },
          {
            model: db.leadsObj,
            as: "budgetLead",
            required: false,
            include: [
              { model: db.projectObj, as: "project", required: false },
              {
                model: db.leadTeamsMemberObj,
                as: "leadTeamMembers",
                required: false,
                separate: true,
              },
            ],
          },
          {
            model: db.budgetBooksScopeIncludesObj,
            as: "budgetBooksScopeIncludes",
            required: false,
            separate: true,
          },
          {
            model: db.budgetBooksDrawingsObj,
            as: "budgetBooksDrawings",
            required: false,
            separate: true,
          },
          {
            model: db.budgetBooksKeyAreasObj,
            as: "budgetBooksKeyAreas",
            required: false,
            separate: true,
          },
          {
            model: db.budgetBooksContractsObj,
            as: "budgetBooksContracts",
            required: false,
            separate: true,
          },
          {
            model: db.sitePlansObj,
            as: "sitePlan",
            required: false,
            include: [
              {
                model: db.budgetBookOthersObj,
                as: "budgetBookOthers",
                required: false,
              },
            ],
            separate: true,
          },
          {
            model: db.sitePlanItemsObj,
            as: "sitePlan2",
            required: false,
            separate: true,
          },
          {
            model: db.projectBudgetsObj,
            as: "budgets",
            required: false,
            separate: true,
          },
          {
            model: db.budgetBooksSitesObj,
            as: "sites",
            required: false,
            separate: true,
          },
          {
            model: db.budgetBookDocumentsObj,
            as: "budgetBookDocuments",
          },

          {
            model: db.budgetBooksScopesObj,
            as: "projectScopes",
            required: false,
            include: [
              {
                model: db.budgetScopeObj,
                as: "scope",
                required: false,
                include: [
                  {
                    model: db.budgetCategoryObj,
                    as: "budgetCategory",
                    required: false,
                  },
                ],
              },
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
                        separate: true,
                      },
                    ],
                    separate: true,
                  },
                ],
                separate: true,
              },
            ],
            separate: true,
          },
        ],
      });

      if (!budgetBook) {
        throw new Error("Budget Book not found");
      }

      return budgetBook;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  async updateBudgetBooks(id, postData) {
    try {
      const [updated] = await db.budgetBooksObj.update(postData, {
        where: { id },
      });

      if (!updated) {
        throw new Error("Budget Book not found or update failed.");
      }

      const updatedBudgetBook = await db.budgetBooksObj.findByPk(id);
      return updatedBudgetBook;
    } catch (error) {
      console.log("DB Update Error:", error);
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(error));
      throw error;
    }
  },
  // async replaceAssociations(
  //   budgetBooksId,
  //   {
  //     budgetBooksScopeIncludes,
  //     budgetBooksDrawings,
  //     budgetBooksKeyAreas,
  //     budgetBooksContracts,
  //   }
  // ) {
  //   try {
  //     await Promise.all([
  //       db.budgetBooksScopeIncludesObj.destroy({
  //         where: { budget_books_id: budgetBooksId },
  //       }),
  //       db.budgetBooksDrawingsObj.destroy({
  //         where: { budget_books_id: budgetBooksId },
  //       }),
  //       db.budgetBooksKeyAreasObj.destroy({
  //         where: { budget_books_id: budgetBooksId },
  //       }),
  //       db.budgetBooksContractsObj.destroy({
  //         where: { budget_books_id: budgetBooksId },
  //       }),
  //     ]);

  //     const promises = [];

  //     if (
  //       Array.isArray(budgetBooksScopeIncludes) &&
  //       budgetBooksScopeIncludes.length
  //     ) {
  //       promises.push(
  //         db.budgetBooksScopeIncludesObj.bulkCreate(
  //           budgetBooksScopeIncludes.map((item) => ({
  //             budget_books_id: budgetBooksId,
  //             budget_category_id: item.budget_category_id,
  //             is_include: item.is_include,
  //             is_exclude: item.is_exclude,
  //           }))
  //         )
  //       );
  //     }

  //     if (Array.isArray(budgetBooksDrawings) && budgetBooksDrawings.length) {
  //       promises.push(
  //         db.budgetBooksDrawingsObj.bulkCreate(
  //           budgetBooksDrawings.map((item) => ({
  //             budget_books_id: budgetBooksId,
  //             submittal_id: item.submittal_id,
  //             is_include: item.is_include,
  //           }))
  //         )
  //       );
  //     }

  //     if (Array.isArray(budgetBooksKeyAreas) && budgetBooksKeyAreas.length) {
  //       promises.push(
  //         db.budgetBooksKeyAreasObj.bulkCreate(
  //           budgetBooksKeyAreas.map((item) => ({
  //             budget_books_id: budgetBooksId,
  //             key_area_id: item.key_area_id,
  //             is_include: item.is_include,
  //           }))
  //         )
  //       );
  //     }

  //     if (Array.isArray(budgetBooksContracts) && budgetBooksContracts.length) {
  //       promises.push(
  //         db.budgetBooksContractsObj.bulkCreate(
  //           budgetBooksContracts.map((item) => ({
  //             budget_books_id: budgetBooksId,
  //             contract_component_id: item.contract_component_id,
  //             is_include: item.is_include,
  //           }))
  //         )
  //       );
  //     }

  //     await Promise.all(promises);
  //   } catch (error) {
  //     logger.errorLog.log("error", commonHelper.customizeCatchMsg(error));
  //     throw error;
  //   }
  // },
  async replaceAssociations(
    budgetBooksId,
    {
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
    }
  ) {
    try {
      // 1️⃣ Delete existing associated records
      await Promise.all([
        db.budgetBooksScopeIncludesObj.destroy({
          where: { budget_books_id: budgetBooksId },
        }),
        db.budgetBooksDrawingsObj.destroy({
          where: { budget_books_id: budgetBooksId },
        }),
        db.budgetBooksKeyAreasObj.destroy({
          where: { budget_books_id: budgetBooksId },
        }),
        db.budgetBooksContractsObj.destroy({
          where: { budget_books_id: budgetBooksId },
        }),
        db.budgetBooksSitesObj.destroy({
          where: { budget_books_id: budgetBooksId },
        }),
        db.projectBudgetsObj.destroy({
          where: { budget_books_id: budgetBooksId },
        }),
        db.sitePlansObj.destroy({ where: { budget_books_id: budgetBooksId } }),
        db.sitePlanItemsObj.destroy({
          where: { budget_books_id: budgetBooksId },
        }),
        db.veOptionsObj.destroy({ where: { budget_books_id: budgetBooksId } }),
        db.optionPackageObj.destroy({
          where: { budget_books_id: budgetBooksId },
        }),
        db.budgetBookOthersObj.destroy({ where: { budget_id: budgetBooksId } }),
        db.budgetBooksScopesObj.destroy({
          where: { budget_books_id: budgetBooksId },
        }),
        db.budgetBooksScopeCategoriesObj.destroy({
          where: { budget_books_scope_id: budgetBooksId },
        }),
        db.budgetBooksScopeGroupsObj.destroy({
          where: { budget_books_scope_category_id: budgetBooksId },
        }),
        db.budgetBooksScopeSegmentsObj.destroy({
          where: { budget_books_scope_group_id: budgetBooksId },
        }),
      ]);

      const promises = [];

      const parseNumber = (val) =>
        val === "" || val === null || val === undefined ? null : Number(val);

      // 2️⃣ Insert BudgetBooksScopeIncludes
      if (
        Array.isArray(budgetBooksScopeIncludes) &&
        budgetBooksScopeIncludes.length
      ) {
        promises.push(
          db.budgetBooksScopeIncludesObj.bulkCreate(
            budgetBooksScopeIncludes.map((item) => ({
              budget_books_id: budgetBooksId,
              budget_category_id: item.budget_category_id,
              is_include: item.is_include,
              is_exclude: item.is_exclude,
            }))
          )
        );   
      }

      // 3️⃣ Insert BudgetBooksDrawings
      if (Array.isArray(budgetBooksDrawings) && budgetBooksDrawings.length) {
        promises.push(
          db.budgetBooksDrawingsObj.bulkCreate(
            budgetBooksDrawings.map((item) => ({
              budget_books_id: budgetBooksId,
              submittal_id: item.submittal_id,
              is_include: item.is_include,
            }))
          )
        );
      }

      // 4️⃣ Insert BudgetBooksKeyAreas
      if (Array.isArray(budgetBooksKeyAreas) && budgetBooksKeyAreas.length) {
        promises.push(
          db.budgetBooksKeyAreasObj.bulkCreate(
            budgetBooksKeyAreas.map((item) => ({
              budget_books_id: budgetBooksId,
              key_area_id: item.key_area_id,
              is_include: item.is_include,
            }))
          )
        );
      }

      // 5️⃣ Insert BudgetBooksContracts
      if (Array.isArray(budgetBooksContracts) && budgetBooksContracts.length) {
        promises.push(
          db.budgetBooksContractsObj.bulkCreate(
            budgetBooksContracts.map((item) => ({
              budget_books_id: budgetBooksId,
              contract_component_id: item.contract_component_id,
              is_include: item.is_include,
            }))
          )
        );
      }

      // 6️⃣ Insert Sites
      if (Array.isArray(sites) && sites.length) {
        promises.push(
          db.budgetBooksSitesObj.bulkCreate(
            sites.map((site) => ({
              budget_books_id: budgetBooksId,
              name: site.name || "",
              site_Id: site.site_Id || "",
              qty: site.qty || 0,
              gs_qft: site.gs_qft || 0,
              ts_qft: site.ts_qft || 0,
              cs_qft: site.cs_qft || 0,
              ps_qft: site.ps_qft || 0,
              cost: site.cost || 0,
              c_total: site.c_total || 0,
              c_sw: site.c_sw || 0,
              c_up: site.c_up || 0,
              c_sp: site.c_sp || 0,
              c_mc: site.c_mc || 0,
              pb_sw: site.pb_sw || 0,
              pb_up: site.pb_up || 0,
              pb_sp: site.pb_sp || 0,
              pb_mc: site.pb_mc || 0,
              pb_tot: site.pb_tot || 0,
              p_tot: site.p_tot || 0,
              p_sw: site.p_sw || 0,
              p_up: site.p_up || 0,
              p_sp: site.p_sp || 0,
              p_mc: site.p_mc || 0,
              project_bldg: site.project_bldg || "",
              project_bldg_type: site.project_bldg_type || "",
              site_design: site.site_design || "",
              site_design_sw: site.site_design_sw || 0,
              site_design_up: site.site_design_up || 0,
              site_engineering: site.site_engineering || "",
              site_engineering_sw: site.site_engineering_sw || 0,
              site_engineering_up: site.site_engineering_up || 0,
              site_budget: site.site_budget || 0,
              site_budget_sp: site.site_budget_sp || 0,
              site_budget_sw: site.site_budget_sw || 0,
              site_budget_up: site.site_budget_up || 0,
              site_budget_mc: site.site_budget_mc || 0,
              site_shipping: site.site_shipping || 0,
              site_shipping_sp: site.site_shipping_sp || 0,
              site_shipping_sw: site.site_shipping_sw || 0,
              site_shipping_up: site.site_shipping_up || 0,
              site_shipping_mc: site.site_shipping_mc || 0,
              site_design_type: site.site_design_type || "",
              site_engineering_type: site.site_engineering_type || "",
              site_budget_type: site.site_budget_type || "",
              site_shipping_type: site.site_shipping_type || "",
            }))
          )
        );
      }

      // 7️⃣ Insert Budgets
      if (Array.isArray(budgets) && budgets.length) {
        const budgetRecords = budgets.map((item) => ({
          budget_books_id: budgetBooksId,
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
          cost: parseNumber(item.cost),
          total: parseNumber(item.total),
        }));
        promises.push(db.projectBudgetsObj.bulkCreate(budgetRecords));
      }

      // 8️⃣ Insert SitePlans
      const sitePlanMap = [];
      if (Array.isArray(sitePlan) && sitePlan.length) {
        const sitePlanRecords = sitePlan.map((item) => ({
          budget_books_id: budgetBooksId,
          site_index: item.site_index ?? null,
          bldg_id: item.bldg_id ?? null,
          site_plan_name: item.sitePlan_name ?? null,
          sov_sp: parseNumber(item.sov_sp),
          sov_td: parseNumber(item.sov_td),
          sov_up: parseNumber(item.sov_up),
          sov_mc: parseNumber(item.sov_mc),
          sov_total: parseNumber(item.sov_total),
          order_no: item.order_no ?? null,
        }));

        const createdSitePlans = await db.sitePlansObj.bulkCreate(
          sitePlanRecords
        );
        createdSitePlans.forEach((plan, idx) => (sitePlanMap[idx] = plan.id));
      }

      // 9️⃣ Insert or Update ScopeOther
      if (Array.isArray(scopeOther) && scopeOther.length) {
        for (const [nestedIndex, siteGroup] of Object.entries(scopeOther)) {
          for (const [budgetCatKey, budgetCatArray] of Object.entries(
            siteGroup
          )) {
            if (
              budgetCatKey === "data" ||
              budgetCatKey === "undefined" ||
              !Array.isArray(budgetCatArray)
            )
              continue;

            for (const item of budgetCatArray) {
              const siteId = item.siteId ?? null;
              const budgetCatId = item.budget_Cat_Id ?? null;

              const dataEntries = Object.values(item.data || {});
              const validDataEntries = dataEntries.filter((d) =>
                Object.values(d || {}).some(
                  (v) => v !== null && v !== "" && v !== undefined
                )
              );

              if (!validDataEntries.length) continue;

              const insertData = validDataEntries.map((d) => ({
                title: d.title || "Other",
                budget_id: budgetBooksId,
                site_id: siteId,
                site_plan_id: sitePlanMap[nestedIndex] ?? null,
                scopeId: d.scopeId ?? null,
                budget_cat_id: budgetCatId,
                is_include: d.is_include ?? null,
                total: parseNumber(d.total),
                price_sqft: parseNumber(d.pricePerSqft),
                additionals: parseNumber(d.additional),
                cost: parseNumber(d.cost),
                price_w_additional: parseNumber(d.priceWithAdditional),
                costSqft: parseNumber(d.costSqft),
                optionPercentage: parseNumber(d.optionPercentage),
                updated_at: new Date(),
              }));

              // 🧠 Safe upsert
              for (const dataRow of insertData) {
                const existing = await db.budgetBookOthersObj.findOne({
                  where: {
                    budget_id: budgetBooksId,
                    site_id: dataRow.site_id,
                    budget_cat_id: dataRow.budget_cat_id,
                    title: dataRow.title,
                  },
                });

                if (existing) {
                  await existing.update(dataRow);
                  console.log(`🔁 Updated scopeOther: ${dataRow.title}`);
                } else {
                  dataRow.created_at = new Date();
                  await db.budgetBookOthersObj.create(dataRow);
                  console.log(`✅ Inserted new scopeOther: ${dataRow.title}`);
                }
              }
            }
          }
        }
      }

      // 10️⃣ Insert SitePlan2
      if (Array.isArray(sitePlan2) && sitePlan2.length) {
        promises.push(
          db.sitePlanItemsObj.bulkCreate(
            sitePlan2.map((item) => ({
              budget_books_id: budgetBooksId,
              sitePlan_name2: item.sitePlan_name2 || null,
              site_qty: item.site_qty || null,
              sov_qa: item.sov_qa || null,
              sov_qr: item.sov_qr || null,
            }))
          )
        );
      }

      // 11️⃣ Insert VE Options
      if (Array.isArray(veOptions) && veOptions.length) {
        promises.push(
          db.veOptionsObj.bulkCreate(
            veOptions.map((item) => ({
              budget_books_id: budgetBooksId,
              subject: item.subject || null,
              description: item.description || null,
              amount: item.amount || null,
              optionDate: item.optionDate || null,
              groups: item.groups || null,
            }))
          )
        );
      }

      // 12️⃣ Insert Option Packages
      if (Array.isArray(optionPackages) && optionPackages.length) {
        promises.push(
          db.optionPackageObj.bulkCreate(
            optionPackages.map((item) => ({
              budget_books_id: budgetBooksId,
              subject: item.subject || null,
              description: item.description || null,
              amount: item.amount || null,
              groups: item.groups || null,
            }))
          )
        );
      }

      // 13️⃣ Insert Scopes
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
              budget_books_id: budgetBooksId,
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

      // 14️⃣ Execute all bulk inserts
      await Promise.all(promises);
    } catch (error) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(error));
      throw error;
    }
  },
  // async deleteBudgetBooks(budgetBooksId) {
  //   try {
  //     const budgetBook = await db.budgetBooksObj.findOne({
  //       where: { id: budgetBooksId },
  //     });

  //     if (!budgetBook) {
  //       return null;
  //     }

  //     // Delete all related associations
  //     await Promise.all([
  //       db.budgetBooksScopeIncludesObj.destroy({
  //         where: { budget_books_id: budgetBooksId },
  //       }),
  //       db.budgetBooksDrawingsObj.destroy({
  //         where: { budget_books_id: budgetBooksId },
  //       }),
  //       db.budgetBooksKeyAreasObj.destroy({
  //         where: { budget_books_id: budgetBooksId },
  //       }),
  //       db.budgetBooksContractsObj.destroy({
  //         where: { budget_books_id: budgetBooksId },
  //       }),
  //       db.budgetBooksSitesObj.destroy({
  //         where: { budget_books_id: budgetBooksId },
  //       }),
  //       db.projectBudgetsObj.destroy({
  //         where: { budget_books_id: budgetBooksId },
  //       }),
  //       db.sitePlansObj.destroy({ where: { budget_books_id: budgetBooksId } }),
  //       db.sitePlanItemsObj.destroy({
  //         where: { budget_books_id: budgetBooksId },
  //       }),
  //       db.veOptionsObj.destroy({ where: { budget_books_id: budgetBooksId } }),
  //       db.optionPackageObj.destroy({
  //         where: { budget_books_id: budgetBooksId },
  //       }),
  //       db.budgetBookOthersObj.destroy({ where: { budget_id: budgetBooksId } }),
  //       db.budgetBooksScopesObj.destroy({
  //         where: { budget_books_id: budgetBooksId },
  //       }),
  //       db.budgetBooksScopeCategoriesObj.destroy({
  //         where: {
  //           budget_books_scope_id: db.Sequelize.literal(`(
  //             SELECT id FROM "budget_books_scopes" WHERE budget_books_id = '${budgetBooksId}'
  //           )`),
  //         },
  //       }),
  //       db.budgetBooksScopeGroupsObj.destroy({
  //         where: {
  //           budget_books_scope_category_id: db.Sequelize.literal(`(
  //             SELECT id FROM "budget_books_scope_categories" WHERE budget_books_scope_id IN (
  //               SELECT id FROM "budget_books_scopes" WHERE budget_books_id = '${budgetBooksId}'
  //             )
  //           )`),
  //         },
  //       }),
  //       db.budgetBooksScopeSegmentsObj.destroy({
  //         where: {
  //           budget_books_scope_group_id: db.Sequelize.literal(`(
  //             SELECT id FROM "budget_books_scope_groups" WHERE budget_books_scope_category_id IN (
  //               SELECT id FROM "budget_books_scope_categories" WHERE budget_books_scope_id IN (
  //                 SELECT id FROM "budget_books_scopes" WHERE budget_books_id = '${budgetBooksId}'
  //               )
  //             )
  //           )`),
  //         },
  //       }),
  //     ]);

  //     // Delete the main budget book
  //     await db.budgetBooksObj.destroy({
  //       where: { id: budgetBooksId },
  //     });

  //     return true;
  //   } catch (error) {
  //     logger.errorLog.log("error", commonHelper.customizeCatchMsg(error));
  //     throw error;
  //   }
  // },

  async deleteBudgetBooks(budgetBooksId) {
    try {
      const budgetBook = await db.budgetBooksObj.findOne({
        where: { id: budgetBooksId },
      });

      if (!budgetBook) return null;

      // Delete simple related tables
      await Promise.all([
        db.budgetBooksScopeIncludesObj.destroy({
          where: { budget_books_id: budgetBooksId },
        }),
        db.budgetBooksDrawingsObj.destroy({
          where: { budget_books_id: budgetBooksId },
        }),
        db.budgetBooksKeyAreasObj.destroy({
          where: { budget_books_id: budgetBooksId },
        }),
        db.budgetBooksContractsObj.destroy({
          where: { budget_books_id: budgetBooksId },
        }),
        db.budgetBooksSitesObj.destroy({
          where: { budget_books_id: budgetBooksId },
        }),
        db.projectBudgetsObj.destroy({
          where: { budget_books_id: budgetBooksId },
        }),
        db.sitePlansObj.destroy({ where: { budget_books_id: budgetBooksId } }),
        db.sitePlanItemsObj.destroy({
          where: { budget_books_id: budgetBooksId },
        }),
        db.veOptionsObj.destroy({ where: { budget_books_id: budgetBooksId } }),
        db.optionPackageObj.destroy({
          where: { budget_books_id: budgetBooksId },
        }),
        db.budgetBookOthersObj.destroy({ where: { budget_id: budgetBooksId } }),
      ]);

      // Delete nested scope hierarchy
      const scopes = await db.budgetBooksScopesObj.findAll({
        where: { budget_books_id: budgetBooksId },
        attributes: ["id"],
      });
      const scopeIds = scopes.map((s) => s.id);

      const categories = await db.budgetBooksScopeCategoriesObj.findAll({
        where: { budget_books_scope_id: scopeIds },
        attributes: ["id"],
      });
      const categoryIds = categories.map((c) => c.id);

      const groups = await db.budgetBooksScopeGroupsObj.findAll({
        where: { budget_books_scope_category_id: categoryIds },
        attributes: ["id"],
      });
      const groupIds = groups.map((g) => g.id);

      await db.budgetBooksScopeSegmentsObj.destroy({
        where: { budget_books_scope_group_id: groupIds },
      });
      await db.budgetBooksScopeGroupsObj.destroy({ where: { id: groupIds } });
      await db.budgetBooksScopeCategoriesObj.destroy({
        where: { id: categoryIds },
      });
      await db.budgetBooksScopesObj.destroy({ where: { id: scopeIds } });

      // Delete the main budget book
      await db.budgetBooksObj.destroy({ where: { id: budgetBooksId } });

      return true;
    } catch (error) {
      console.error("Delete Budget Book Error:", error);
      throw error;
    }
  },

  // async deleteBudgetBooks(budgetBooksId) {
  //   try {
  //     const budgetBook = await db.budgetBooksObj.findOne({
  //       where: { id: budgetBooksId },
  //     });

  //     if (!budgetBook) {
  //       return null;
  //     }

  //     await Promise.all([
  //       db.budgetBooksScopeIncludesObj.destroy({
  //         where: { budget_books_id: budgetBooksId },
  //       }),
  //       db.budgetBooksDrawingsObj.destroy({
  //         where: { budget_books_id: budgetBooksId },
  //       }),
  //       db.budgetBooksKeyAreasObj.destroy({
  //         where: { budget_books_id: budgetBooksId },
  //       }),
  //       db.budgetBooksContractsObj.destroy({
  //         where: { budget_books_id: budgetBooksId },
  //       }),
  //     ]);

  //     await db.budgetBooksObj.destroy({
  //       where: { id: budgetBooksId },
  //     });

  //     return true;
  //   } catch (error) {
  //     logger.errorLog.log("error", commonHelper.customizeCatchMsg(error));
  //     throw error;
  //   }
  // },
  async getAllBudgetCategory() {
    try {
      const budgetCategories = await db.budgetCategoryObj.findAll({
        where: { status: "active" },
        order: [["id", "ASC"]],
      });

      if (!budgetCategories || !budgetCategories.length) return [];

      const categoryIds = budgetCategories.map((c) => c.id);
      const scopes = await db.budgetScopeObj.findAll({
        where: {
          status: "active",
          category_id: { [Op.in]: categoryIds },
        },
      });

      const scopeIds = scopes.map((s) => s.id);
      if (!scopeIds.length) {
        return budgetCategories.map((category) => ({
          budgetCategory: {
            id: category.id,
            catName: (category.catName || category.name || "").toUpperCase(),
            cat_value: slugify(category.catName || category.name || "", {
              replacement: "_",
              lower: true,
              strict: true,
            }),
          },
          scopes: [],
        }));
      }

      const scopeCategories = await db.scopeCategoryObj.findAll({
        where: { scope_id: { [Op.in]: scopeIds } },
      });

      const scopeCategoryIds = scopeCategories.map((sc) => sc.id);

      const groups = await db.scopeGroupObj.findAll({
        where: { scope_category_id: { [Op.in]: scopeCategoryIds } },
      });

      const groupIds = groups.map((g) => g.id);

      const segments = await db.scopeSegmentObj.findAll({
        where: { scope_group_id: { [Op.in]: groupIds } },
      });

      const segmentIds = segments.map((s) => s.id);

      const projectSegments = segmentIds.length
        ? await db.budgetBooksScopeSegmentsObj.findAll({
          where: {
            [Op.or]: [{ scope_sagment_id: { [Op.in]: segmentIds } }],
          },
        })
        : [];

      const scopesByCategoryId = {};
      scopes.forEach((s) => {
        scopesByCategoryId[s.category_id] =
          scopesByCategoryId[s.category_id] || [];
        scopesByCategoryId[s.category_id].push(s);
      });

      const categoriesByScopeId = {};
      scopeCategories.forEach((sc) => {
        categoriesByScopeId[sc.scope_id] =
          categoriesByScopeId[sc.scope_id] || [];
        categoriesByScopeId[sc.scope_id].push(sc);
      });

      const groupsByScopeCategoryId = {};
      groups.forEach((g) => {
        groupsByScopeCategoryId[g.scope_category_id] =
          groupsByScopeCategoryId[g.scope_category_id] || [];
        groupsByScopeCategoryId[g.scope_category_id].push(g);
      });

      const segmentsByGroupId = {};
      segments.forEach((seg) => {
        segmentsByGroupId[seg.scope_group_id] =
          segmentsByGroupId[seg.scope_group_id] || [];
        segmentsByGroupId[seg.scope_group_id].push(seg);
      });

      const projectSegmentsBySegmentId = {};
      projectSegments.forEach((ps) => {
        const key =
          ps.scope_sagment_id || ps.scope_segment_id || ps.scopeSegmentId;
        if (!key) return;
        projectSegmentsBySegmentId[key] = projectSegmentsBySegmentId[key] || [];
        projectSegmentsBySegmentId[key].push(ps);
      });

      const allCategoryData = budgetCategories.map((category) => {
        const catScopes = scopesByCategoryId[category.id] || [];

        const scopesData = catScopes.map((scope) => {
          const cats = categoriesByScopeId[scope.id] || [];

          const categoriesData = cats.map((cat) => {
            const catGroups = groupsByScopeCategoryId[cat.id] || [];

            const groupsData = catGroups.map((group) => {
              const groupSegments = segmentsByGroupId[group.id] || [];

              const sagmentsData = groupSegments.map((sagment) => {
                const matched = projectSegmentsBySegmentId[sagment.id] || [];

                const data = matched.map((item) => ({
                  site_id: item.site_id,
                  segments: [
                    {
                      price_sqft: item.price_sqft,
                      additionals: item.additionals,
                      price_w_additional: item.price_w_additional,
                      cost: item.cost,
                      budgetIndex: item.budgetIndex,
                    },
                  ],
                }));

                return {
                  scope_sagment_id: sagment.id,
                  title: sagment.title,
                  option: sagment.options || "",
                  url: sagment.url || "",
                  data,
                };
              });

              return {
                scope_group_id: group.id,
                title: group.title,
                sagments: sagmentsData,
              };
            });

            return {
              scope_category_id: cat.id,
              title: cat.title,
              groups: groupsData,
            };
          });

          return {
            scope_id: scope.id,
            title: scope.title,
            short_title: scope.short_title,
            categories: categoriesData,
          };
        });

        const originalName = category.catName || category.name || "";

        return {
          budgetCategory: {
            id: category.id,
            catName: originalName.toUpperCase(),
            cat_value: slugify(originalName, {
              replacement: "_",
              lower: true,
              strict: true,
            }),
          },
          scopes: scopesData,
        };
      });

      return allCategoryData;
    } catch (e) {
      console.error("Error in getAllBudgetCategory:", e);
      throw e;
    }
  },
};
