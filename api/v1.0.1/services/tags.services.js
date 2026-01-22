var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op, Sequelize } = require("sequelize");

module.exports = {
  /*addTags*/
  async addTags(postData) {
    try {
      let tag = await db.tagsObj.create(postData);
      return tag;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  // async getAllTags({ page, per_page, search, id }) {
  //   try {
  //     let whereCondition = {};

  //     // Search filter
  //     if (search && search.trim() !== "") {
  //       const searchTerm = search.trim();
  //       whereCondition[Op.or] = [
  //         { title: { [Op.iLike]: `%${searchTerm}%` } },
  //         { color: { [Op.iLike]: `%${searchTerm}%` } },
  //         { type: { [Op.iLike]: `%${searchTerm}%` } },
  //       ];
  //     }

  //     // Detect pagination or no pagination
  //     const paginationEnabled = page && per_page;

  //     const limit = paginationEnabled ? parseInt(per_page) : null;
  //     const offset = paginationEnabled ? (parseInt(page) - 1) * parseInt(per_page) : null;

  //     const { rows, count } = await db.tagsObj.findAndCountAll({
  //       where: whereCondition,
  //       ...(limit ? { limit } : {}),   // Add limit only if pagination
  //       ...(offset ? { offset } : {}),
  //       order: [["id", "DESC"]],
  //       raw: true,
  //     });

  //     let lastPage = paginationEnabled ? Math.ceil(count / limit) : 1;

  //     return {
  //       data: rows,
  //       meta: {
  //         current_page: parseInt(page),
  //         from: offset + 1,
  //         to: offset + rows.length,
  //         last_page: lastPage,
  //         per_page: limit,
  //         total: count
  //       },
  //     };
  //   } catch (e) {
  //     throw e;
  //   }
  // },
  async getAllTags({ page, per_page, search, id }) {
    try {
      let whereCondition = {};

      // Search filter (same)
      if (search && search.trim() !== "") {
        const searchTerm = search.trim();
        whereCondition[Op.or] = [
          { title: { [Op.iLike]: `%${searchTerm}%` } },
          { color: { [Op.iLike]: `%${searchTerm}%` } },
          { type: { [Op.iLike]: `%${searchTerm}%` } },
        ];
      }

      // Pagination detect (same)
      const paginationEnabled = page && per_page;

      const limit = paginationEnabled ? parseInt(per_page) : null;
      const offset = paginationEnabled
        ? (parseInt(page) - 1) * parseInt(per_page)
        : 0;

      const { rows, count } = await db.tagsObj.findAndCountAll({
        where: whereCondition,
        ...(limit ? { limit } : {}),
        ...(paginationEnabled ? { offset } : {}),
        order: [["id", "DESC"]],
        raw: true,
      });

      // ---------- LAZY LOAD META ----------
      const total = count;
      const current_count = rows.length;
      const loaded_till_now = paginationEnabled
        ? offset + current_count
        : current_count;
      const remaining = Math.max(total - loaded_till_now, 0);
      const has_more = loaded_till_now < total;

      return {
        data: rows,
        meta: {
          page: paginationEnabled ? parseInt(page) : 1,
          limit: limit,
          current_count,
          loaded_till_now,
          remaining,
          total,
          has_more,
        },
      };
    } catch (e) {
      throw e;
    }
  },

  /*getTagsById*/
  async getTagsById(tagId) {
    try {
      let tag = await db.tagsObj.findOne({
        where: { id: tagId }
      });
      return tag;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*deleteTags*/
  async deleteTags(tagId) {
    try {
      let deleteTag = await db.tagsObj.destroy({
        where: { id: tagId }
      });
      return deleteTag;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*updateTags*/
  async updateTags(data, tagId) {
    try {
      let updateTag = await db.tagsObj.update(data, {
        where: { id: tagId }
      });
      return updateTag;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
}