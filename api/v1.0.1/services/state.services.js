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


  // async getAllState({ page = 1, per_page = 10, search = "", id }) {
  //   try {
  //     const limit = per_page;
  //     const offset = (page - 1) * limit;

  //     const whereCondition = {};

  //     // Search condition
  //     if (search) {
  //       whereCondition[Op.or] = [
  //         { name: { [Op.iLike]: `%${search}%` } }
  //       ];
  //     }

  //     // Build order condition
  //     let orderCondition = [["order", "ASC"]];
  //     let idInt = null;
  //     let idsArray = [];

  //     if (id) {
  //       try {
  //         if (id.startsWith && id.startsWith("[")) {
  //           idsArray = JSON.parse(id)
  //             .map(x => parseInt(x))
  //             .filter(x => !Number.isNaN(x));
  //         } else {
  //           const parsed = parseInt(id);
  //           if (!Number.isNaN(parsed)) {
  //             idInt = parsed;
  //           }
  //         }
  //       } catch (err) {
  //         console.log("Invalid id format", err);
  //       }
  //     }

  //     if (idInt || (idsArray && idsArray.length > 0)) {
  //       let caseExpr;
  //       if (idsArray.length > 0) {
  //         caseExpr = `CASE WHEN id IN (${idsArray.join(",")}) THEN 0 ELSE 1 END`;
  //       } else {
  //         caseExpr = `CASE WHEN id = ${idInt} THEN 0 ELSE 1 END`;
  //       }

  //       orderCondition = [
  //         [db.Sequelize.literal(caseExpr), "ASC"],
  //         ["order", "ASC"]
  //       ];
  //     }

  //     const { rows, count } = await db.stateObj.findAndCountAll({
  //       where: whereCondition,
  //       order: orderCondition,
  //       limit,
  //       offset
  //     });

  //     return {
  //       data: rows,
  //       meta: {
  //         total: count,
  //         page,
  //         per_page
  //       }
  //     };
  //   } catch (e) {
  //     logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //     throw e;
  //   }
  // },
  async getAllState({ page = 1, per_page = 10, search = "", id }) {
    try {
      page = Math.max(parseInt(page) || 1, 1);
      const limit = Math.max(parseInt(per_page) || 10, 1);
      const offset = (page - 1) * limit;

      const whereCondition = {};

      // ---------- Search (same) ----------
      if (search) {
        whereCondition[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } }
        ];
      }

      // ---------- Order logic (same) ----------
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

      // ---------- DB query (same) ----------
      const { rows, count } = await db.stateObj.findAndCountAll({
        where: whereCondition,
        order: orderCondition,
        limit,
        offset
      });

      // ---------- LAZY LOAD META ----------
      const total = count;
      const current_count = rows.length;
      const loaded_till_now = offset + current_count;
      const remaining = Math.max(total - loaded_till_now, 0);
      const has_more = loaded_till_now < total;

      return {
        data: rows,
        meta: {
          page,
          limit,
          current_count,
          loaded_till_now,
          remaining,
          total,
          has_more
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
