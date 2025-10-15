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
              model: db.budgetBooksScopeCategoriesObj,
              as: "categories",
              required: false,
              separate: true,
              include: [
                {
                  model: db.budgetBooksScopeGroupsObj,
                  as: "groups",
                  required: false,
                  separate: true,
                  include: [
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
            include: [
              {
                model: db.budgetBooksScopeCategoriesObj,
                as: "categories",
                required: false,
                include: [
                  {
                    model: db.budgetBooksScopeGroupsObj,
                    as: "groups",
                    required: false,
                    include: [
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
  async replaceAssociations(
    budgetBooksId,
    {
      budgetBooksScopeIncludes,
      budgetBooksDrawings,
      budgetBooksKeyAreas,
      budgetBooksContracts,
    }
  ) {
    try {
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
      ]);

      const promises = [];

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

      await Promise.all(promises);
    } catch (error) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(error));
      throw error;
    }
  },

  async deleteBudgetBooks(budgetBooksId) {
    try {
      const budgetBook = await db.budgetBooksObj.findOne({
        where: { id: budgetBooksId },
      });

      if (!budgetBook) {
        return null;
      }

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
      ]);

      await db.budgetBooksObj.destroy({
        where: { id: budgetBooksId },
      });

      return true;
    } catch (error) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(error));
      throw error;
    }
  },
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
