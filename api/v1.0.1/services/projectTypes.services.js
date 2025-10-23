var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op } = require("sequelize");

module.exports = {
  /*addProjectTypes*/
  async addProjectTypes(postData) {
    try {
      let projectTypes = await db.projectTypesObj.create(postData);
      return projectTypes;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*getAllProjectTypes*/
  async getAllProjectTypes({ page, per_page, search }) {
    try {
      const offset = (page - 1) * per_page;

      const whereCondition = {};

      if (search) {
        whereCondition[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { color: { [Op.iLike]: `%${search}%` } },
        ];
      }

      const { rows, count } = await db.projectTypesObj.findAndCountAll({
        where: whereCondition,
        order: [["id", "DESC"]],
        per_page,
        offset,
      });

      return {
        total: count,
        page,
        per_page,
        data: rows,
      };
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*getProjectTypesById*/
  async getProjectTypesById(id) {
    try {
      const projectTypes = await db.projectTypesObj.findOne({
        where: { id },
      });

      if (!projectTypes) {
        throw new Error("Project types not found");
      }

      return projectTypes;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*deleteProjectTypes*/
  async deleteProjectTypes(id) {
    try {
      const projectTypes = await db.projectTypesObj.findOne({ where: { id } });
      if (!projectTypes) {
        throw new Error("Project types not found");
      }

      // Soft delete
      await projectTypes.destroy();

      return true;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*updateProjectTypes*/
  async updateProjectTypes(id, postData) {
    try {
      const projectTypes = await db.projectTypesObj.findOne({
        where: { id: parseInt(id) },
      });
      if (!projectTypes) throw new Error("Project types not found");

      const updated = await projectTypes.update(postData);
      return updated;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
