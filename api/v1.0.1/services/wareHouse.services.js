var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op, Sequelize } = require("sequelize");

module.exports = {
  async addWareHouse(postData) {
    try {
      const wareHouse = await db.wareHouseObj.create(postData);
      return wareHouse;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /* Get All WareHouse */
  // async getAllWareHouse({ page, per_page, search, limit, take_all, id }) {
  //   try {
  //     page = parseInt(page) || 1;
  //     per_page = parseInt(per_page) || 10;
  //     limit = parseInt(limit) || per_page;
  //     const offset = (page - 1) * per_page;

  //     let whereCondition = {};
  //     if (search) {
  //       whereCondition = {
  //         name: { [Op.like]: `%${search}%` },
  //       };
  //     }

  //     let order = [["id", "DESC"]];
  //     if (id) {
  //       order = [
  //         [
  //           Sequelize.literal(
  //             `CASE WHEN id = ${parseInt(id)} THEN 0 ELSE 1 END`
  //           ),
  //           "ASC",
  //         ],
  //         ["id", "DESC"],
  //       ];
  //     }

  //     if (take_all === "all") {
  //       const wareHouses = await db.wareHouseObj.findAll({
  //         where: whereCondition,
  //         order,
  //         ...(limit ? { limit } : {}),
  //       });

  //       return {
  //         data: wareHouses,
  //         meta: {
  //           current_page: 1,
  //           from: 1,
  //           to: wareHouses.length,
  //           per_page: limit || wareHouses.length,
  //           total: wareHouses.length,
  //           last_page: 1,
  //         },
  //       };
  //     }

  //     const { rows, count } = await db.wareHouseObj.findAndCountAll({
  //       where: whereCondition,
  //       order,
  //       limit: per_page,
  //       offset,
  //     });

  //     return {
  //       data: rows,
  //       meta: {
  //         current_page: page,
  //         from: offset + 1,
  //         to: offset + rows.length,
  //         per_page,
  //         total: count,
  //         last_page: Math.ceil(count / per_page),
  //       },
  //     };
  //   } catch (e) {
  //     logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //     throw e;
  //   }
  // },
  async getAllWareHouse({ page, per_page, search, limit, take_all, id }) {
    try {
      page = parseInt(page) || 1;
      per_page = parseInt(per_page) || 10;
      limit = parseInt(limit) || per_page;
      const offset = (page - 1) * per_page;

      let whereCondition = {};

      // ---------- search (same) ----------
      if (search) {
        whereCondition = {
          name: { [Op.like]: `%${search}%` },
        };
      }

      // ---------- order with priority id (same) ----------
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

      // ---------- TAKE ALL (same) ----------
      if (take_all === "all") {
        const wareHouses = await db.wareHouseObj.findAll({
          where: whereCondition,
          order,
          ...(limit ? { limit } : {}),
        });

        const total = wareHouses.length;

        return {
          data: wareHouses,
          meta: {
            page: 1,
            limit: limit || total,
            current_count: total,
            loaded_till_now: total,
            remaining: 0,
            total,
            has_more: false,
          },
        };
      }

      // ---------- PAGINATED QUERY (same) ----------
      const { rows, count } = await db.wareHouseObj.findAndCountAll({
        where: whereCondition,
        order,
        limit: per_page,
        offset,
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
          limit: per_page,
          current_count,
          loaded_till_now,
          remaining,
          total,
          has_more,
        },
      };
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /* Update WareHouse */
  async updateWareHouse(wareHouseId, data) {
    try {
      const [updated] = await db.wareHouseObj.update(data, {
        where: { id: wareHouseId },
      });

      if (!updated) return null;

      return await db.wareHouseObj.findOne({ where: { id: wareHouseId } });
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /* Get WareHouse By Id */
  async getWareHouseById(wareHouseId) {
    try {
      const wareHouse = await db.wareHouseObj.findOne({
        where: { id: wareHouseId },
        raw: true,
      });
      return wareHouse;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /* Delete WareHouse */
  async deleteWareHouse(wareHouseIds) {
    try {
      const ids = Array.isArray(wareHouseIds) ? wareHouseIds : [wareHouseIds];
      const deleted = await db.wareHouseObj.destroy({
        where: { id: ids },
      });
      return deleted; // returns number of rows deleted (0 or 1)
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
