var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op, Sequelize } = require("sequelize");

module.exports = {
  /*addUnits*/
  async addUnits(postData) {
    try {
      let unit = await db.unitObj.create(postData);
      return unit;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
 
  async getAllAddUnits({ page, per_page, limit, take_all, search, id, per_id }) {
    try {
      page = parseInt(page) || 1;
      per_page = parseInt(per_page) || 10;
      limit = parseInt(limit) || per_page;
      const offset = (page - 1) * limit;

      let whereCondition = {};
      if (search) {
        whereCondition.name = { [Op.like]: `%${search}%` };
      }

      // Collect prioritized ids
      let ids = [];
      const collectIds = (value) => {
        if (Array.isArray(value)) return value.map(v => parseInt(v)).filter(v => !isNaN(v));
        else if (value) {
          let num = parseInt(value);
          return !isNaN(num) ? [num] : [];
        }
        return [];
      };
      ids = [...collectIds(id), ...collectIds(per_id)];

      // Fetch prioritized units
      let prioritizedUnits = [];
      if (ids.length > 0) {
        prioritizedUnits = await db.unitObj.findAll({
          where: { id: { [Op.in]: ids } },
          order: [["id", "DESC"]],
        });
      }

      const excludeCondition = ids.length > 0 ? { id: { [Op.notIn]: ids } } : {};

      // Handle take_all
      if (take_all === "all") {
        const units = await db.unitObj.findAll({
          where: { ...whereCondition, ...excludeCondition },
          order: [["id", "DESC"]],
        });
        const finalUnits = [...prioritizedUnits, ...units];

        return {
          data: finalUnits,
          meta: {
            current_page: 1,
            from: finalUnits.length ? 1 : 0,
            to: finalUnits.length,
            per_page: finalUnits.length,
            total: finalUnits.length,
            last_page: 1
          }
        };
      }

      // Paginated fetch
      const { rows, count } = await db.unitObj.findAndCountAll({
        where: { ...whereCondition, ...excludeCondition },
        limit,
        offset,
        order: [["id", "DESC"]],
      });

      const finalUnits = [...prioritizedUnits, ...rows];
      const total = count + prioritizedUnits.length;
      const from = total ? offset + 1 : 0;
      const to = offset + finalUnits.length;
      const last_page = Math.ceil(total / limit);

      return {
        data: finalUnits,
        meta: {
          current_page: page,
          from,
          to,
          per_page: limit,
          total,
          last_page
        }
      };
    } catch (e) {
      console.error(commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },


  /*getUnitById*/
  async getUnitById(unitId) {
    try {
      let units = await db.unitObj.findOne({
        where: { id: unitId },
      });
      return units;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*deleteUnits*/
  async deleteUnits(unitId) {
    try {
      let deleteUnit = await db.unitObj.destroy({
        where: { id: unitId },
      });
      return deleteUnit;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*updateUnits*/
  async updateUnits(data, unitId) {
    try {
      let units = await db.unitObj.update(data, {
        where: { id: unitId },
      });
      return units;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
