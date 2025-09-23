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
  /*getAddUnits*/
  // async getAddUnits({ page, per_page, search, id }) {
  //   try {
  //     const limit = parseInt(per_page);
  //     const offset = (page - 1) * limit;

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

  //     const { rows, count } = await db.unitObj.findAndCountAll({
  //       where: whereCondition,
  //       limit,
  //       offset,
  //       order: [["created_at", "DESC"]],
  //     });

  //     return {
  //       total: count,
  //       page: parseInt(page),
  //       per_page: limit,
  //       totalPages: Math.ceil(count / limit),
  //       units: rows,
  //     };
  //   } catch (e) {
  //     logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //     throw e;
  //   }
  // },
  // async getAddUnits({ page, per_page, limit, take_all, search, id }) {
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

  //     let prioritizedUnit = null;
  //     if (id) {
  //       prioritizedUnit = await db.unitObj.findOne({ where: { id } });
  //     }

  //     if (take_all === "all") {
  //       const units = await db.unitObj.findAll({
  //         where: id
  //           ? { ...whereCondition, id: { [Op.ne]: id } }
  //           : whereCondition,
  //         order: [["id", "DESC"]],
  //         ...(limit ? { limit } : {}),
  //       });

  //       const finalUnits = prioritizedUnit
  //         ? [prioritizedUnit, ...units]
  //         : units;

  //       return { data: finalUnits, total: finalUnits.length };
  //     }

  //     const { rows, count } = await db.unitObj.findAndCountAll({
  //       where: id ? { ...whereCondition, id: { [Op.ne]: id } } : whereCondition,
  //       limit: per_page,
  //       offset,
  //       order: [["id", "DESC"]],
  //     });

  //     const finalUnits = prioritizedUnit ? [prioritizedUnit, ...rows] : rows;

  //     return {
  //       total: count + (prioritizedUnit ? 1 : 0),
  //       page,
  //       per_page,
  //       totalPages: Math.ceil((count + (prioritizedUnit ? 1 : 0)) / per_page),
  //       units: finalUnits,
  //     };
  //   } catch (e) {
  //     console.error(commonHelper.customizeCatchMsg(e));
  //     throw e;
  //   }
  // },
  // ================ Service =================
async getAddUnits({ page, per_page, limit, take_all, search, id, per_id }) {
  try {
    page = parseInt(page) || 1;
    per_page = parseInt(per_page) || 10;

    // prefer explicit limit over per_page
    limit = parseInt(limit) || per_page;
    const offset = (page - 1) * limit;

    let whereCondition = {};
    if (search) {
      whereCondition.name = { [Op.like]: `%${search}%` };
    }

    // 🔹 Collect ids from both id[] and per_id[]
    let ids = [];
    const collectIds = (value) => {
      if (Array.isArray(value)) {
        return value
          .map((v) => parseInt(v))
          .filter((v) => !isNaN(v));
      } else if (value) {
        let num = parseInt(value);
        return !isNaN(num) ? [num] : [];
      }
      return [];
    };

    ids = [...collectIds(id), ...collectIds(per_id)];

    // 🔹 Fetch prioritized units first (keep order)
    let prioritizedUnits = [];
    if (ids.length > 0) {
      prioritizedUnits = await db.unitObj.findAll({
        where: { id: { [Op.in]: ids } },
        order: [["id", "DESC"]],
      });
    }

    // 🔹 Exclude prioritized ids from main query
    const excludeCondition =
      ids.length > 0 ? { id: { [Op.notIn]: ids } } : {};

    // Handle "take_all"
    if (take_all && take_all === "all") {
      const units = await db.unitObj.findAll({
        where: { ...whereCondition, ...excludeCondition },
        order: [["id", "DESC"]],
        ...(limit ? { limit } : {}),
      });

      const finalUnits = [...prioritizedUnits, ...units];

      return {
        total: finalUnits.length,
        units: finalUnits,
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

    return {
      total: count + prioritizedUnits.length,
      page,
      per_page: limit,
      totalPages: Math.ceil((count + prioritizedUnits.length) / limit),
      units: finalUnits,
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
