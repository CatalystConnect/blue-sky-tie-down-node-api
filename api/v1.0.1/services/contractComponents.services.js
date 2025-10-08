var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op, Sequelize } = require("sequelize");

module.exports = {
  async addContractComponents(postData) {
    try {
      return await db.contractComponentsObj.create(postData);
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  async getAllContractComponents(query = {}) {
    try {
      let { page, per_page, take_all } = query;

      page = parseInt(page) || 1;
      per_page = parseInt(per_page) || 10;
      const offset = (page - 1) * per_page;

      if (take_all === "all") {
        const components = await db.contractComponentsObj.findAll({
          order: [["id", "DESC"]],
        });

        return {
          data: components,
          meta: {
            current_page: 1,
            from: 1,
            to: components.length,
            per_page: components.length,
            total: components.length,
            last_page: 1,
          },
        };
      }

      const { rows, count } = await db.contractComponentsObj.findAndCountAll({
        order: [["id", "DESC"]],
        limit: per_page,
        offset,
      });

      return {
        data: rows,
        meta: {
          current_page: page,
          from: offset + 1,
          to: offset + rows.length,
          per_page,
          total: count,
          last_page: Math.ceil(count / per_page),
        },
      };
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  async getContractComponentsById(id) {
    try {
      return await db.contractComponentsObj.findOne({ where: { id } });
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  async updateContractComponents(id, data) {
    try {
      const component = await db.contractComponentsObj.findOne({
        where: { id },
      });
      if (!component) return null;

      await component.update(data);
      return component;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  async deleteContractComponents(id) {
    try {
      const component = await db.contractComponentsObj.findOne({
        where: { id },
      });
      if (!component) return null;

      await component.destroy();
      return true;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
