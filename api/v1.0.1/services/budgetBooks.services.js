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

  async getAllBudgetBooks() {
    try {
      const budgetBooks = await db.budgetBooksObj.findAll({
        order: [["created_at", "DESC"]],
        include: [
          {
            model: db.budgetBooksScopeIncludesObj,
            as: "budgetBooksScopeIncludes",
          },
          { model: db.budgetBooksDrawingsObj, as: "budgetBooksDrawings" },
          { model: db.budgetBooksKeyAreasObj, as: "budgetBooksKeyAreas" },
          { model: db.budgetBooksContractsObj, as: "budgetBooksContracts" },
          { model: db.projectObj, as: "budgetProject" },
          { model: db.leadsObj, as: "budgetLead" },
        ],
      });
      return budgetBooks;
    } catch (error) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(error));
      throw error;
    }
  },

  async getBudgetBooksById(budgetBooksId) {
    try {
      const budgetBook = await db.budgetBooksObj.findOne({
        where: { id: budgetBooksId },
        include: [
          {
            model: db.budgetBooksScopeIncludesObj,
            as: "budgetBooksScopeIncludes",
          },
          { model: db.budgetBooksDrawingsObj, as: "budgetBooksDrawings" },
          { model: db.budgetBooksKeyAreasObj, as: "budgetBooksKeyAreas" },
          { model: db.budgetBooksContractsObj, as: "budgetBooksContracts" },
          { model: db.projectObj, as: "budgetProject" },
          { model: db.leadsObj, as: "budgetLead" },
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
      projectScopeIncludes,
      projectSubmittals,
      projectKeyAreas,
      projectContracts,
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

      if (Array.isArray(projectScopeIncludes) && projectScopeIncludes.length) {
        promises.push(
          db.budgetBooksScopeIncludesObj.bulkCreate(
            projectScopeIncludes.map((item) => ({
              budget_books_id: budgetBooksId,
              budget_category_id: item.budget_category_id,
              is_include: item.is_include,
              is_exclude: item.is_exclude,
            }))
          )
        );
      }

      if (Array.isArray(projectSubmittals) && projectSubmittals.length) {
        promises.push(
          db.budgetBooksDrawingsObj.bulkCreate(
            projectSubmittals.map((item) => ({
              budget_books_id: budgetBooksId,
              submittal_id: item.submittal_id,
              is_include: item.is_include,
            }))
          )
        );
      }

      if (Array.isArray(projectKeyAreas) && projectKeyAreas.length) {
        promises.push(
          db.budgetBooksKeyAreasObj.bulkCreate(
            projectKeyAreas.map((item) => ({
              budget_books_id: budgetBooksId,
              key_area_id: item.key_area_id,
              is_include: item.is_include,
            }))
          )
        );
      }

      if (Array.isArray(projectContracts) && projectContracts.length) {
        promises.push(
          db.budgetBooksContractsObj.bulkCreate(
            projectContracts.map((item) => ({
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
        ? await db.projectScopeSegmentsObj.findAll({
            where: {
              [Op.or]: [
                { scope_sagment_id: { [Op.in]: segmentIds } },
              ],
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
