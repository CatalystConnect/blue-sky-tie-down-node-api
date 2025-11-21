var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op } = require("sequelize");

module.exports = {
  /*addProductPhases*/
  async addProductPhases(postData) {
    try {
      let addProductPhases = await db.projectPhasesObj.create(postData);
      return addProductPhases;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*getAllProductPhases*/
  async getAllProductPhases({ page, per_page, search, id }) {
    try {
      const limit = per_page
      const offset = (page - 1) * limit;

      const whereCondition = {};

      if (search) {
        whereCondition[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },

        ];
      }

      if (id) {
        try {
          if (id.startsWith("[")) {
            const idsArray = JSON.parse(id);
            whereCondition.id = { [Op.in]: idsArray };
          } else {
            whereCondition.id = parseInt(id);
          }
        } catch (err) {
          console.log("Invalid id format", err);
        }
      }

      const { rows, count } = await db.projectPhasesObj.findAndCountAll({
        where: whereCondition,
        order: [["order", "ASC"]],
        limit,
        offset,
      });

      return {
        data: rows,
        meta: {
          total: count,
          page,
          per_page,
          // hasPrevPage: page > 1
        }
      }
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*getProductPhasesById*/
  async getProductPhasesById(id) {
    try {
      const projectTypes = await db.projectPhasesObj.findOne({
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

  /*deleteproductPhases*/
  async deleteproductPhases(id) {
    try {
      const projectPhases = await db.projectPhasesObj.findOne({ where: { id } });
      if (!projectPhases) {
        throw new Error("project Phases types not found");
      }

      // Soft delete
      await projectPhases.destroy();

      return true;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*updateProductPhases*/
  async updateProductPhases(id, postData) {
    try {
      const projectPhases = await db.projectPhasesObj.findOne({
        where: { id: parseInt(id) },
      });
      if (!projectPhases) throw new Error("Product Phases not found");

      const updated = await projectPhases.update(postData);
      return updated;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
