var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op } = require("sequelize");

module.exports = {
  /*addVendors*/
  async addVendors(postData) {
    try {
      let vendor = await db.vendorsObj.create(postData);
      return vendor;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*getVendorsById*/
  async getVendorsById(vendorId) {
    try {
      let vendors = await db.vendorsObj.findOne({
        where: { id: vendorId },
      });
      return vendors;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*getAllVendors*/
  // async getAllVendors({ page, per_page, search }) {
  //     try {
  //         const limit = parseInt(per_page);
  //         const offset = (page - 1) * limit;

  //         let whereCondition = {};
  //         if (search) {
  //             whereCondition = {
  //                 name: { [Op.like]: `%${search}%` },
  //             };
  //         }

  //         const { rows, count } = await db.vendorsObj.findAndCountAll({
  //             where: whereCondition,
  //             limit,
  //             offset,
  //             order: [["created_at", "DESC"]],
  //         });

  //         return {
  //             total: count,
  //             page: parseInt(page),
  //             per_page: limit,
  //             totalPages: Math.ceil(count / limit),
  //             vendors: rows,
  //         };
  //     } catch (e) {
  //         logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //         throw e;
  //     }
  // },
  //   async getAllVendors({ page, per_page, search, id, limit, take_all }) {
  //     try {
  //       page = parseInt(page) || 1;
  //       per_page = parseInt(per_page) || 10;

  //       let finalLimit = per_page;
  //       let offset = (page - 1) * finalLimit;

  //       // If take_all=all → return all vendors without pagination
  //       if (take_all === "all") {
  //         finalLimit = limit ? parseInt(limit) : null; // if limit provided use it, else no limit
  //         offset = 0;
  //       }

  //       let whereCondition = {};
  //       if (search) {
  //         whereCondition = {
  //           ...whereCondition,
  //           name: { [Op.like]: `%${search}%` },
  //         };
  //       }

  //       let prioritizedVendors = [];
  //       if (id && Array.isArray(id)) {
  //         prioritizedVendors = await db.vendorsObj.findAll({
  //           where: { id: { [Op.in]: id } },
  //         });

  //         // Exclude prioritized IDs from main query
  //         whereCondition = {
  //           ...whereCondition,
  //           id: { [Op.notIn]: id },
  //         };
  //       }

  //       const { rows, count } = await db.vendorsObj.findAndCountAll({
  //         where: whereCondition,
  //         limit: finalLimit,
  //         offset,
  //         order: [["id", "DESC"]],
  //       });

  //       // Merge prioritized vendors first
  //       const finalVendors = [...prioritizedVendors, ...rows];

  //       return {
  //         total: count + prioritizedVendors.length,
  //         page,
  //         per_page: finalLimit,
  //         totalPages: finalLimit
  //           ? Math.ceil((count + prioritizedVendors.length) / finalLimit)
  //           : 1,
  //         vendors: finalVendors,
  //       };
  //     } catch (e) {
  //       logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //       throw e;
  //     }
  //   },

  async getAllVendors({ page, per_page, search, id, limit, take_all }) {
    try {
      page = parseInt(page) || 1;
      per_page = parseInt(per_page) || 10;

      let finalLimit = per_page;
      let offset = (page - 1) * finalLimit;

      let whereCondition = {};
      if (search) {
        whereCondition = {
          ...whereCondition,
          name: { [Op.like]: `%${search}%` },
        };
      }

      // ✅ Prioritized vendors
      let prioritizedVendors = [];
      if (id && Array.isArray(id)) {
        prioritizedVendors = await db.vendorsObj.findAll({
          where: { id: { [Op.in]: id } },
          order: [["id", "DESC"]],
        });

        whereCondition = {
          ...whereCondition,
          id: { [Op.notIn]: id },
        };
      }

      let rows = [];
      let count = 0;

      if (take_all === "all") {
        rows = await db.vendorsObj.findAll({
          where: whereCondition,
          order: [["id", "DESC"]],
          ...(limit ? { limit: parseInt(limit) } : {}),
        });
        count = rows.length;
      } else {
        const result = await db.vendorsObj.findAndCountAll({
          where: whereCondition,
          limit: finalLimit,
          offset,
          order: [["id", "DESC"]],
        });
        rows = result.rows;
        count = result.count;
      }

      // Merge prioritized vendors first
      const finalVendors = [...prioritizedVendors, ...rows];

      return {
        data: finalVendors,
        meta: {
          current_page: take_all === "all" ? 1 : page,
          from: take_all === "all" ? 1 : offset + 1,
          to: take_all === "all" ? finalVendors.length : offset + rows.length,
          per_page: take_all === "all" ? (limit ? parseInt(limit) : finalVendors.length) : finalLimit,
          total: count + prioritizedVendors.length,
          last_page: take_all === "all" ? 1 : Math.ceil((count + prioritizedVendors.length) / finalLimit)
        }
      };
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*deleteVendors*/
  async deleteVendors(vendorId) {
    try {
      let deleteVendor = await db.vendorsObj.destroy({
        where: { id: vendorId },
      });
      return deleteVendor;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*updateVendors*/
  async updateVendors(data, vendorId) {
    try {
      let vendors = await db.vendorsObj.update(data, {
        where: { id: vendorId },
      });
      return vendors;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
