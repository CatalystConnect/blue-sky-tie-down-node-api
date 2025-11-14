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
        category_id: data.category_id,
        user_id: req.userId,
      };
      const scopeObj = await budgetScopeServices.add(postData);
      const scopeId = scopeObj.id;
      let scopeCategories = data.categories;

      for (let i = 0; i < scopeCategories.length; i++) {
        const category = scopeCategories[i];
        const catPostData = {
          user_id: req.userId,
          scope_id: scopeId,
          title: category.title,
          order_index: i,
        };
        const categoryObj = await scopeCategoryServices.add(catPostData);
        const categoryId = categoryObj.id;

        for (let j = 0; j < category.groups.length; j++) {
          const group = category.groups[j];
          const groupPostData = {
            user_id: req.userId,
            scope_category_id: categoryId,
            title: group.title,
          };
          const groupObj = await scopeGroupServices.add(groupPostData);
          const groupId = groupObj.id;

          for (let k = 0; k < group.segments.length; k++) {
            const segment = group.segments[k];
            const segmentPostData = {
              user_id: req.userId,
              scope_group_id: groupId,
              title: segment.title,
              url: segment.url,
              options: JSON.stringify(segment.option),
            };
            const segmentObj = await scopeSegmentServices.add(segmentPostData);
            const segmentId = segmentObj.id;
          }
        }
      }

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            { scopeId },
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
        return res.status(200).send(
          commonHelper.parseErrorRespose({
            id: "Budget scopes id is required",
          })
        );
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
        return res.status(200).send(
          commonHelper.parseErrorRespose({
            id: "Budget scopes id is required",
          })
        );
      }

      let scopeId = id;
      const result = await budgetScopeServices.getById(id);
      let scopeCategories = result.categories;
      await budgetScopeServices.delete(scopeId);

      for (let i = 0; i < scopeCategories.length; i++) {
        const category = scopeCategories[i];
        const categoryId = category.id;
        await scopeCategoryServices.delete(categoryId);
        for (let j = 0; j < category.groups.length; j++) {
          const group = category.groups[j];
          const groupId = group.id;
          await scopeGroupServices.delete(groupId);
          for (let k = 0; k < group.segments.length; k++) {
            const segment = group.segments[k];
            const segmentId = segment.id;
            await scopeSegmentServices.delete(segmentId);
          }
        }
      }

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
  // async updateBudgetScope(req, res) {
  //   try {
  //     const errors = myValidationResult(req);
  //     if (!errors.isEmpty()) {
  //       return res
  //         .status(200)
  //         .send(commonHelper.parseErrorRespose(errors.mapped()));
  //     }

  //     const { id } = req.query;
  //     if (!id) {
  //       return res
  //         .status(200)
  //         .send(commonHelper.parseErrorRespose({ id: "Budget scopes id is required" }));
  //     }

  //     const data = req.body;
  //     const scopeId = id;

  //     const postData = {
  //       title       : data.title,
  //       short_title : data.short_title,
  //       status      : data.status,
  //       category_id : data.category_id,
  //     };
  //     await budgetScopeServices.update(scopeId, postData);

  //     let scopeCategories = data.categories;

  //     // Update / Insert node
  //     for (let i = 0; i < scopeCategories.length; i++) {
  //       const category = scopeCategories[i];
  //       let categoryId;
  //       if( category?.id ){
  //         categoryId = category.id;
  //         const catPostData = {
  //           title : category.title,
  //            order_index: i,
  //         }
  //         await scopeCategoryServices.update(categoryId, catPostData);
  //       }else{
  //         const catPostData = {
  //           user_id : req.userId,
  //           scope_id : scopeId,
  //           title : category.title,
  //           order_index: i,
  //         }
  //         const categoryObj = await scopeCategoryServices.add(catPostData);
  //         categoryId = categoryObj.id;
  //       }

  //       for (let j = 0; j < category.groups.length; j++) {
  //         const group = category.groups[j];
  //         let groupId;
  //         if( group?.id ){
  //           groupId = group.id;
  //           const groupPostData = {
  //             title : group.title
  //           }
  //           await scopeGroupServices.update(groupId, groupPostData);
  //         }else{
  //           const groupPostData = {
  //             user_id : req.userId,
  //             scope_category_id : categoryId,
  //             title : group.title
  //           }
  //           const groupObj = await scopeGroupServices.add(groupPostData);
  //           groupId = groupObj.id;
  //         }

  //         for (let k = 0; k < group.segments.length; k++) {
  //           const segment = group.segments[k];
  //           let segmentId;
  //           if( segment?.id ){
  //             segmentId = segment.id;
  //             const segmentPostData = {
  //               title : segment.title,
  //               url : segment.url,
  //               options : JSON.stringify(segment.option)
  //             }
  //             await scopeSegmentServices.update(segmentId, segmentPostData);
  //           }else{
  //             const segmentPostData = {
  //               user_id : req.userId,
  //               scope_group_id : groupId,
  //               title : segment.title,
  //               url : segment.url,
  //               options : JSON.stringify(segment.option)
  //             }
  //             const segmentObj = await scopeSegmentServices.add(segmentPostData);
  //             segmentId = segmentObj.id;
  //           }
  //         }
  //       }
  //     }

  //     // Delete Node
  //     const deleteCategory = data.delete.category;
  //     const deleteGroup = data.delete.group;
  //     const deleteSegment = data.delete.segment;

  //     for (let i = 0; i < deleteCategory.length; i++) {
  //       const categoryId = deleteCategory[i];

  //       const groups = await scopeGroupServices.findByCategoryId(categoryId);
  //       for (let j = 0; j < groups.length; j++) {
  //         const group = groups[j];
  //         const groupId = group.id;
  //         const segments = await scopeSegmentServices.findByGroupId(groupId);
  //         for (let k = 0; k < segments.length; k++) {
  //           const segment = segments[k];
  //           const segmentId = segment.id;
  //           await scopeSegmentServices.delete(segmentId);
  //         }
  //         await scopeGroupServices.delete(groupId);
  //       }
  //       await scopeCategoryServices.delete(categoryId);

  //     }

  //     for (let i = 0; i < deleteGroup.length; i++) {
  //       const groupId = deleteGroup[i];
  //        const segments = await scopeSegmentServices.findByGroupId(groupId);
  //       for (let k = 0; k < segments.length; k++) {
  //         const segment = segments[k];
  //         const segmentId = segment.id;
  //         await scopeSegmentServices.delete(segmentId);
  //       }
  //       await scopeGroupServices.delete(groupId);

  //     }

  //     for (let i = 0; i < deleteSegment.length; i++) {
  //       const segmentId = deleteSegment[i];
  //       await scopeSegmentServices.delete(segmentId);
  //     }

  //     return res
  //       .status(200)
  //       .send(
  //         commonHelper.parseSuccessRespose(
  //           "",
  //           "Budget scope updated successfully"
  //         )
  //       );
  //   } catch (error) {
  //     return res.status(400).json({
  //       status: false,
  //       message:
  //         error.response?.data?.error ||
  //         error.message ||
  //         "Update budget scope failed",
  //       data: error.response?.data || {},
  //     });
  //   }
  // },

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
        return res.status(200).send(
          commonHelper.parseErrorRespose({
            id: "Budget scope id is required",
          })
        );
      }

      const data = req.body;
      const scopeId = id;

      // Update general scope info
      await budgetScopeServices.update(scopeId, {
        title: data.title,
        short_title: data.short_title,
        status: data.status,
        category_id: data.category_id,
      });

      const scopeCategories = data.categories;      

      /**
       * ----------------------------------------------------------------
       *  UPDATE / INSERT (CATEGORY → GROUP → SEGMENT)
       * ----------------------------------------------------------------
       */
      for (let i = 0; i < scopeCategories.length; i++) {
        const category = scopeCategories[i];
        let categoryId;

        // ------------------------ CATEGORY ---------------------------
        if (category.id) {
          categoryId = category.id;

          await scopeCategoryServices.update(categoryId, {
            title: category.title,
            order_index: i, // update order after drag-drop
          });
        } else {
          const newCat = await scopeCategoryServices.add({
            user_id: req.userId,
            scope_id: scopeId,
            title: category.title,
            order_index: i,
          });
          categoryId = newCat.id;
          category.id = categoryId;
        }

        // ------------------------ GROUPS ---------------------------
        for (let j = 0; j < category.groups.length; j++) {
          const group = category.groups[j];
          let groupId;

          if (group.id) {
            groupId = group.id;

            await scopeGroupServices.update(groupId, {
              title: group.title,
              scope_category_id: categoryId, // IMPORTANT (DRAG & DROP)
            });
          } else {
            const newGroup = await scopeGroupServices.add({
              user_id: req.userId,
              scope_category_id: categoryId,
              title: group.title,
            });

            groupId = newGroup.id;
          }

          // ------------------------ SEGMENTS ---------------------------
          for (let k = 0; k < group.segments.length; k++) {
            const segment = group.segments[k];
            let segmentId;

            if (segment.id) {
              segmentId = segment.id;
              await scopeSegmentServices.update(segmentId, {
                title: segment.title,
                url: segment.url,
                options: JSON.stringify(segment.option),
                scope_group_id: groupId, // IMPORTANT (DRAG & DROP)
              });
            } else {
              const newSeg = await scopeSegmentServices.add({
                user_id: req.userId,
                scope_group_id: groupId,
                title: segment.title,
                url: segment.url,
                options: JSON.stringify(segment.option),
              });

              segmentId = newSeg.id;
            }
          }
        }
      }

      /**
       * ----------------------------------------------------------------
       *  DELETE ZOMBIE NODES
       * ----------------------------------------------------------------
       */
      const { category: delCat, group: delGrp, segment: delSeg } = data.delete;

      // delete segments
      for (let s = 0; s < delSeg.length; s++) {
        await scopeSegmentServices.delete(delSeg[s]);
      }

      // delete groups
      for (let g = 0; g < delGrp.length; g++) {
        const segs = await scopeSegmentServices.findByGroupId(delGrp[g]);
        for (let s = 0; s < segs.length; s++) {
          await scopeSegmentServices.delete(segs[s].id);
        }
        await scopeGroupServices.delete(delGrp[g]);
      }

      // delete categories
      for (let c = 0; c < delCat.length; c++) {
        const groups = await scopeGroupServices.findByCategoryId(delCat[c]);
        for (let g = 0; g < groups.length; g++) {
          const segs = await scopeSegmentServices.findByGroupId(groups[g].id);
          for (let s = 0; s < segs.length; s++) {
            await scopeSegmentServices.delete(segs[s].id);
          }
          await scopeGroupServices.delete(groups[g].id);
        }
        await scopeCategoryServices.delete(delCat[c]);
      }

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            "",
            "Budget scope updated successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Update failed",
        data: {},
      });
    }
  },
};
