var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op } = require("sequelize");

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
  /*getAllTags*/
  async getAllTags({ page, per_page, search }) {
    try {
      const limit = parseInt(per_page);
      const offset = (page - 1) * limit;

      let whereCondition = {};
      if (search) {
        whereCondition = {
          [Op.or]: [
            { title: { [Op.like]: `%${search}%` } },
            { color: { [Op.like]: `%${search}%` } },
            { type: { [Op.like]: `%${search}%` } },
          ]
        };
      }

      const { rows, count } = await db.tagsObj.findAndCountAll({
        where: whereCondition,
        limit,
        offset,
        order: [["id", "DESC"]],
        raw: true
      });

      const lastPage = Math.ceil(count / limit);

      return {
        data: rows,
        meta: {
          current_page: page,
          from: offset + 1,
          to: offset + rows.length,
          last_page: lastPage,
          per_page: limit,
          total: count
        }
      };
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
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