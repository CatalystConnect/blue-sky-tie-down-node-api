var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op, Sequelize } = require("sequelize");

module.exports = {
  /*addtaxes*/
  async addtaxes(postData) {
    try {
      let taxes = await db.taxesObj.create(postData);
      return taxes;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  async getAllTaxes({ page, per_page, search, limit, take_all, id }) {
    try {
      page = parseInt(page) || 1;
      per_page = parseInt(per_page) || 10;
      limit = parseInt(limit) || per_page;
      const offset = (page - 1) * per_page;

      let whereCondition = {};
      if (search) {
        whereCondition = {
          name: { [Op.like]: `%${search}%` },
        };
      }

      let order = [["id", "DESC"]];
      if (id) {
        order = [
          [
            Sequelize.literal(
              `CASE WHEN id = ${parseInt(id)} THEN 0 ELSE 1 END`
            ),
            "ASC",
          ],
          ["id", "DESC"],
        ];
      }

      if (take_all === "all") {
        const taxes = await db.taxesObj.findAll({
          where: whereCondition,
          order,
          limit: limit || undefined,
        });
        return { data: taxes, total: taxes.length };
      }

      const { rows, count } = await db.taxesObj.findAndCountAll({
        where: whereCondition,
        order,
        limit: per_page,
        offset,
      });

      return {
        data: rows,
        total: count,
        current_page: page,
        per_page,
        last_page: Math.ceil(count / per_page),
      };
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  // /*get by id taxes*/
  async getTaxesById(id) {
    try {
      return await db.taxesObj.findOne({
        where: { id: id },
      });
    } catch (e) {
      logger.error(commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*delete by id taxes*/
  async deleteTaxes(id) {
    try {
      const taxes = await db.taxesObj.findByPk(id);

      if (!taxes) {
        return false;
      }

      await taxes.destroy();
      return true;
    } catch (e) {
      logger.error(commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  // /*update by id taxes*/
  async updateTaxes(id, updatedData) {
    try {
      const taxes = await db.taxesObj.findByPk(id);

      if (!taxes) {
        return null;
      }

      await taxes.update(updatedData);
      return taxes;
    } catch (e) {
      console.error("Service Update taxes Error:", e.message);
      throw e;
    }
  },
};
