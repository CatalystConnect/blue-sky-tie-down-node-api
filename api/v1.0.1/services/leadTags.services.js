var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op } = require("sequelize");

module.exports = {
    /*addleadTags*/
    async addleadTags(postData) {
        try {
            let leadTags = await db.leadTagsObj.create(postData);
            return leadTags;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /* Get All Lead Tags */
    async getAllleadTags({ page = 1, limit = 10, search }) {
        try {
            page = parseInt(page);
            limit = parseInt(limit);
            const offset = (page - 1) * limit;

            let whereCondition = {};
            if (search) {

                whereCondition = {
                    [Op.or]: [
                        { '$lead.title$': { [Op.like]: `%${search}%` } },
                        { '$tag.name$': { [Op.like]: `%${search}%` } },
                    ],
                };
            }

            const { count, rows } = await db.leadTagsObj.findAndCountAll({
                where: whereCondition,
                include: [
                    {
                        model: db.leadsObj,
                        as: "lead",

                    },
                    {
                        model: db.tagsObj,
                        as: "tag",

                    },
                ],
                order: [["id", "ASC"]],
                offset,
                limit,
            });

            return {
                total: count,
                page,
                limit,
                data: rows,
            };
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /* Get Lead Tag by ID */
    async getleadTagsById(id) {
        try {
            const leadTag = await db.leadTagsObj.findOne({
                where: { id },
                include: [
                    { model: db.leadsObj, as: "lead" },
                    { model: db.tagsObj, as: "tag" },
                ],
            });

            return leadTag;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /* Delete Lead Tag by ID (soft delete) */
    async deleteleadTags(id) {
        try {
            const leadTag = await db.leadTagsObj.findOne({ where: { id } });
            if (!leadTag) return null;

            await leadTag.destroy(); 
            return true;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
     /* Update Lead Tag by ID */
  async updateleadTags(id, postData) {
    try {
      const leadTag = await db.leadTagsObj.findOne({ where: { id } });
      if (!leadTag) {
        throw new Error("Lead Tag not found");
      }

      await leadTag.update(postData);

      
      const updated = await db.leadTagsObj.findOne({
        where: { id },
        include: [
          { model: db.leadsObj, as: "lead" },
          { model: db.tagsObj, as: "tag" },
        ],
      });

      return updated;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
}