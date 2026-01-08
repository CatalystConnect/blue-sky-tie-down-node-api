var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op } = require("sequelize");

module.exports = {
  /*addBudgetCategory*/
  async add(postData) {
    try {
      return await db.budgetScopeObj.create(postData);
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*getAllBudgetCategories*/
  async getAll({ page, limit, search }) {
    try {
      const offset = (page - 1) * limit;

      const whereCondition = {};
      if (search) {
        whereCondition[Op.or] = [{ name: { [Op.iLike]: `%${search}%` } }];
      }

      const { rows, count } = await db.budgetScopeObj.findAndCountAll({
        where: whereCondition,
        include: [
          {
            model: db.budgetCategoryObj,
            as: "budgetCategory",
          },
        ],
        order: [["id", "DESC"]], // order by 'ordering' column
        limit,
        offset,
      });

      // Pagination metadata
      const lastPage = Math.ceil(count / limit);
      const from = count > 0 ? offset + 1 : 0;
      const to = offset + rows.length;

      return {
        data: rows,
        meta: {
          current_page: page,
          from: from,
          to: to,
          per_page: limit,
          last_page: lastPage,
          total: count,
        },
      };
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*getBudgetKeyAreasById*/

  // async getById(id) {
  //   try {
  //     const category = await db.budgetScopeObj.findOne({
  //       where: { id },
  //       include: [
  //         {
  //           model: db.scopeCategoryObj,
  //           as: "categories",
  //           order: [["order_index", "ASC"]],
  //           include: [
  //             {
  //               model: db.scopeGroupObj,
  //               as: "groups",
  //               include: [
  //                 {
  //                   model: db.scopeSegmentObj,
  //                   as: "segments",
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //       ],
  //     });

  //     if (!category) {
  //       throw new Error("Budget scope not found");
  //     }

  //     // Convert Sequelize data → clean JSON response
  //     const response = {
  //       id: category.id,
  //       user_id: category.user_id,
  //       category_id: category.category_id,
  //       title: category.title,
  //       short_title: category.short_title,
  //       status: category.status,
  //       created_at: category.created_at,
  //       updated_at: category.updated_at,
  //       deleted_at: category.deleted_at,

  //       categories: category.categories.map((cat) => ({
  //         id: cat.id,
  //         cate_id: cat.id, // 👈 REQUIRED
  //         title: cat.title,
  //         order_index: cat.order_index,

  //         groups: (cat.groups || []).map((group) => ({
  //           id: group.id,
  //           group_id: group.id,
  //           title: group.title,
  //           scope_category_id: group.scope_category_id,

  //           segments: (group.segments || []).map((seg) => ({
  //             id: seg.id,
  //             segment_id: seg.id,
  //             title: seg.title,
  //             url: seg.url,
  //             option: seg.options || [],
  //             scope_group_id: seg.scope_group_id,
  //           })),
  //         })),
  //       })),
  //     };

  //     return response;
  //   } catch (e) {
  //     logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //     throw e;
  //   }
  // },

  // async getById(id) {
  //   try {
  //     const category = await db.budgetScopeObj.findOne({
  //       where: { id },
  //       include: [
  //         {
  //           model: db.scopeCategoryObj,
  //           as: "categories",
  //           order: [["order_index", "ASC"]],
  //           include: [
  //             {
  //               model: db.scopeGroupObj,
  //               as: "groups",
  //               include: [
  //                 {
  //                   model: db.scopeSegmentObj,
  //                   as: "segments",
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //       ],
  //     });

  //     if (!category) {
  //       throw new Error("Budget scope not found");
  //     }

  //     // ---------- 1. Fetch allocated categories, groups, segments ----------
  //     const categoryIds = category.categories.map((cat) => cat.id);
  //     const groupIds = category.categories.flatMap((cat) =>
  //       (cat.groups || []).map((g) => g.id)
  //     );
  //     const segmentIds = category.categories.flatMap((cat) =>
  //       (cat.groups || []).flatMap((g) => (g.segments || []).map((s) => s.id))
  //     );

  //     // Fetch allocated IDs from other tables
  //     const budgetCategories = await db.budgetBooksScopeCategoriesObj.findAll({
  //       where: { scope_category_id: { [Op.in]: categoryIds } },
  //       attributes: ["scope_category_id"],
  //     });
  //     const budgetGroups = await db.budgetBooksScopeGroupsObj.findAll({
  //       where: { scope_group_id: { [Op.in]: groupIds } },
  //       attributes: ["scope_group_id"],
  //     });
  //     const budgetSegments = await db.budgetBooksScopeSegmentsObj.findAll({
  //       where: {
  //         scope_sagment_id: { [Op.in]: segmentIds },
  //       },
  //       attributes: ["scope_sagment_id"],
  //     });

  //     // Convert to Sets for fast lookup
  //     const budgetCategorySet = new Set(
  //       budgetCategories.map((i) => i.scope_category_id)
  //     );
  //     const budgetGroupSet = new Set(budgetGroups.map((i) => i.scope_group_id));
  //     const budgetSegmentSet = new Set(
  //       budgetSegments.map((i) => i.scope_sagment_id)
  //     );

  //     // Convert Sequelize data → clean JSON response
  //     const response = {
  //       id: category.id,
  //       user_id: category.user_id,
  //       category_id: category.category_id,
  //       title: category.title,
  //       short_title: category.short_title,
  //       status: category.status,
  //       created_at: category.created_at,
  //       updated_at: category.updated_at,
  //       deleted_at: category.deleted_at,

  //       categories: category.categories.map((cat) => ({
  //         id: cat.id,
  //         cate_id: cat.id, // 👈 REQUIRED
  //         title: cat.title,
  //         order_index: cat.order_index,
  //         categoriesAlloted: budgetCategorySet.has(cat.id),

  //         groups: (cat.groups || []).map((group) => ({
  //           id: group.id,
  //           group_id: group.id,
  //           title: group.title,
  //           scope_category_id: group.scope_category_id,
  //           groupsAlloted: budgetGroupSet.has(group.id),

  //           segments: (group.segments || []).map((seg) => ({
  //             id: seg.id,
  //             segment_id: seg.id,
  //             title: seg.title,
  //             url: seg.url,
  //             option: seg.options || [],
  //             scope_group_id: seg.scope_group_id,
  //             segmentsAlloted: budgetSegmentSet.has(seg.id),
  //           })),
  //         })),
  //       })),
  //     };

  //     return response;
  //   } catch (e) {
  //     logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //     throw e;
  //   }
  // },

  async getById(id) {
    try {
      const category = await db.budgetScopeObj.findOne({
        where: { id },
        include: [
          {
            model: db.scopeCategoryObj,
            as: "categories",
            order: [["order_index", "ASC"]],
            include: [
              {
                model: db.scopeGroupObj,
                as: "groups",
                include: [
                  {
                    model: db.scopeSegmentObj,
                    as: "segments",
                  },
                ],
              },
            ],
          },
        ],
      });

      if (!category) {
        throw new Error("Budget scope not found");
      }

      // ---------- Collect IDs ----------
      const categoryIds = category.categories.map((c) => c.id);
      const groupIds = category.categories.flatMap((c) =>
        (c.groups || []).map((g) => g.id)
      );
      const segmentIds = category.categories.flatMap((c) =>
        (c.groups || []).flatMap((g) => (g.segments || []).map((s) => s.id))
      );

      // ---------- Fetch allocated data ----------
      const budgetCategories = await db.budgetBooksScopeCategoriesObj.findAll({
        where: { scope_category_id: { [Op.in]: categoryIds } },
        attributes: ["scope_category_id"],
      });

      const budgetGroups = await db.budgetBooksScopeGroupsObj.findAll({
        where: { scope_group_id: { [Op.in]: groupIds } },
        attributes: ["scope_group_id"],
      });

      const budgetSegments = await db.budgetBooksScopeSegmentsObj.findAll({
        where: { scope_sagment_id: { [Op.in]: segmentIds } },
        attributes: ["scope_sagment_id", "conditions"],
        include: [
          {
            model: db.scopeSegmentObj,
            as: "scopeSagment",
            attributes: ["options"],
          },
        ],
      });

      // ---------- Helpers ----------
      const parseOptions = (val) => {
        if (!val) return [];
        if (Array.isArray(val)) return val;

        try {
          return JSON.parse(val);
        } catch {
          return val
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean);
        }
      };

      // ---------- Build allocation maps ----------
      const budgetCategorySet = new Set(
        budgetCategories.map((i) => i.scope_category_id)
      );

      const budgetGroupSet = new Set(budgetGroups.map((i) => i.scope_group_id));

      const segmentAllocationMap = new Map();

      budgetSegments.forEach((item) => {
        const segmentId = item.scope_sagment_id;

        const scopeOptions = parseOptions(item.scopeSagment?.options);
        const conditionOptions = parseOptions(item.conditions);

        const matchedOptions = scopeOptions.filter((opt) =>
          conditionOptions.includes(opt)
        );

        segmentAllocationMap.set(segmentId, {
          allocated: matchedOptions.length > 0,
          matchedOptions,
        });
      });

      // ---------- Final Response ----------
      const response = {
        id: category.id,
        user_id: category.user_id,
        category_id: category.category_id,
        title: category.title,
        short_title: category.short_title,
        status: category.status,
        created_at: category.created_at,
        updated_at: category.updated_at,
        deleted_at: category.deleted_at,

        categories: category.categories.map((cat) => ({
          id: cat.id,
          cate_id: cat.id,
          title: cat.title,
          order_index: cat.order_index,
          categoriesAlloted: budgetCategorySet.has(cat.id),

          groups: (cat.groups || []).map((group) => ({
            id: group.id,
            group_id: group.id,
            title: group.title,
            scope_category_id: group.scope_category_id,
            groupsAlloted: budgetGroupSet.has(group.id),

            segments: (group.segments || []).map((seg) => {
              const allocation = segmentAllocationMap.get(seg.id);

              return {
                id: seg.id,
                segment_id: seg.id,
                title: seg.title,
                url: seg.url,
                option: parseOptions(seg.options),
                scope_group_id: seg.scope_group_id,

                segmentsAlloted: allocation?.allocated || false,
                allocatedOptions: allocation?.matchedOptions || [],
              };
            }),
          })),
        })),
      };

      return response;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*deleteBudgetKeyAreas*/
  async delete(id) {
    try {
      const category = await db.budgetScopeObj.findOne({ where: { id } });
      if (!category) {
        throw new Error("Budget scope not found");
      }

      // Soft delete
      await category.destroy();

      return true;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*updateBudgetKeyAreas*/
  async update(id, postData) {
    try {
      const category = await db.budgetScopeObj.findOne({
        where: { id: parseInt(id) },
      });
      if (!category) throw new Error("Budget scope not found");

      const updated = await category.update(postData);
      return updated;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
