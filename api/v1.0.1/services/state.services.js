var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op } = require("sequelize");

module.exports = {
  /*addState*/
  async addState(postData) {
    try {
      let addState = await db.stateObj.create(postData);
      return addState;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*getAllState*/
  // async getAllState({ page, per_page, search, id }) {
  //   try {
  //     const limit = per_page
  //     const offset = (page - 1) * limit;

  //     const whereCondition = {};

  //     if (search) {
  //       whereCondition[Op.or] = [
  //         { name: { [Op.iLike]: `%${search}%` } },

  //       ];
  //     }

  //     if (id) {
  //       try {
  //         if (id.startsWith("[")) {
  //           const idsArray = JSON.parse(id);
  //           whereCondition.id = { [Op.in]: idsArray };
  //         } else {
  //           whereCondition.id = parseInt(id);
  //         }
  //       } catch (err) {
  //         console.log("Invalid id format", err);
  //       }
  //     }

  //     const { rows, count } = await db.stateObj.findAndCountAll({
  //       where: whereCondition,
  //       order: [["order", "ASC"]],
  //       limit,
  //       offset,
  //     });

  //     return {
  //       data: rows,
  //       meta: {
  //         total: count,
  //         page,
  //         per_page,
  //         // hasPrevPage: page > 1
  //       }
  //     }
  //   } catch (e) {
  //     logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //     throw e;
  //   }
  // },
  async getAllState({ page = 1, per_page = 10, search = "", id }) {
    try {
      const limit = per_page;
      const offset = (page - 1) * limit;

      const whereCondition = {};

      // Search condition
      if (search) {
        whereCondition[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } }
        ];
      }

      // Build order condition
      let orderCondition = [["order", "ASC"]];
      let idInt = null;
      let idsArray = [];

      if (id) {
        try {
          if (id.startsWith && id.startsWith("[")) {
            idsArray = JSON.parse(id)
              .map(x => parseInt(x))
              .filter(x => !Number.isNaN(x));
          } else {
            const parsed = parseInt(id);
            if (!Number.isNaN(parsed)) {
              idInt = parsed;
            }
          }
        } catch (err) {
          console.log("Invalid id format", err);
        }
      }

      if (idInt || (idsArray && idsArray.length > 0)) {
        let caseExpr;
        if (idsArray.length > 0) {
          caseExpr = `CASE WHEN id IN (${idsArray.join(",")}) THEN 0 ELSE 1 END`;
        } else {
          caseExpr = `CASE WHEN id = ${idInt} THEN 0 ELSE 1 END`;
        }

        orderCondition = [
          [db.Sequelize.literal(caseExpr), "ASC"],
          ["order", "ASC"]
        ];
      }

      const { rows, count } = await db.stateObj.findAndCountAll({
        where: whereCondition,
        order: orderCondition,
        limit,
        offset
      });

      return {
        data: rows,
        meta: {
          total: count,
          page,
          per_page
        }
      };
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*getStateById*/
  async getStateById(id) {
    try {
      const stateById = await db.stateObj.findOne({
        where: { id },
      });

      if (!stateById) {
        throw new Error("stateById not found");
      }

      return stateById;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*deleteState*/
  async deleteState(id) {
    try {
      const state = await db.stateObj.findOne({ where: { id } });
      if (!state) {
        throw new Error("state   not found");
      }

      // Soft delete
      await state.destroy();

      return true;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*updateState*/
  async updateState(id, postData) {
    try {
      const state = await db.stateObj.findOne({
        where: { id: parseInt(id) },
      });
      if (!state) throw new Error("state not found");

      const updated = await state.update(postData);
      return updated;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
