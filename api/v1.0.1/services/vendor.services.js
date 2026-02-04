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

  // async getAllVendors({ page, per_page, search, id, limit, take_all }) {
  //   try {
  //     page = parseInt(page) || 1;
  //     per_page = parseInt(per_page) || 10;

  //     let finalLimit = per_page;
  //     let offset = (page - 1) * finalLimit;

  //     let whereCondition = {};
  //     if (search) {
  //       whereCondition = {
  //         ...whereCondition,
  //         name: { [Op.like]: `%${search}%` },
  //       };
  //     }

  //     // ✅ Prioritized vendors
  //     let prioritizedVendors = [];
  //     if (id && Array.isArray(id)) {
  //       prioritizedVendors = await db.vendorsObj.findAll({
  //         where: { id: { [Op.in]: id } },
  //         order: [["id", "DESC"]],
  //       });

  //       whereCondition = {
  //         ...whereCondition,
  //         id: { [Op.notIn]: id },
  //       };
  //     }

  //     let rows = [];
  //     let count = 0;

  //     if (take_all === "all") {
  //       rows = await db.vendorsObj.findAll({
  //         where: whereCondition,
  //         order: [["id", "DESC"]],
  //         ...(limit ? { limit: parseInt(limit) } : {}),
  //       });
  //       count = rows.length;
  //     } else {
  //       const result = await db.vendorsObj.findAndCountAll({
  //         where: whereCondition,
  //         limit: finalLimit,
  //         offset,
  //         order: [["id", "DESC"]],
  //       });
  //       rows = result.rows;
  //       count = result.count;
  //     }

  //     // Merge prioritized vendors first
  //     const finalVendors = [...prioritizedVendors, ...rows];

  //     return {
  //       data: finalVendors,
  //       meta: {
  //         current_page: take_all === "all" ? 1 : page,
  //         from: take_all === "all" ? 1 : offset + 1,
  //         to: take_all === "all" ? finalVendors.length : offset + rows.length,
  //         per_page: take_all === "all" ? (limit ? parseInt(limit) : finalVendors.length) : finalLimit,
  //         total: count + prioritizedVendors.length,
  //         last_page: take_all === "all" ? 1 : Math.ceil((count + prioritizedVendors.length) / finalLimit)
  //       }
  //     };
  //   } catch (e) {
  //     logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //     throw e;
  //   }
  // },
  async getAllVendors({ page, per_page, search, id, limit, take_all }) {
    try {
      page = parseInt(page) || 1;
      per_page = parseInt(per_page) || 10;

      const finalLimit = parseInt(limit) || per_page;
      const offset = (page - 1) * finalLimit;

      let whereCondition = {};

      // ---------- search (same) ----------
      if (search) {
        whereCondition = {
          ...whereCondition,
          name: { [Op.like]: `%${search}%` },
        };
      }

      // ---------- prioritized vendors (same) ----------
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

      // ---------- take all (same) ----------
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

      // ---------- merge priority first (same) ----------
      const finalVendors = [...prioritizedVendors, ...rows];

      // ---------- LAZY LOAD META (NEW, SAFE) ----------
      const total = count + prioritizedVendors.length;
      const current_count = finalVendors.length;
      const loaded_till_now =
        take_all === "all" ? total : offset + rows.length + prioritizedVendors.length;
      const remaining = Math.max(total - loaded_till_now, 0);
      const has_more = loaded_till_now < total;

      return {
        data: finalVendors,
        meta: {
          page: take_all === "all" ? 1 : page,
          limit: finalLimit,
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
  // async getAllVendors({
  //   page,
  //   per_page,
  //   search,
  //   id,
  //   limit,
  //   take_all,
  // }) {
  //   try {
  //     page = parseInt(page) || 1;
  //     per_page = parseInt(per_page) || 10;

  //     const finalLimit = parseInt(limit) || per_page;
  //     const offset = (page - 1) * finalLimit;

  //     let whereCondition = {};

  //     // ---------- search ----------
  //     if (search) {
  //       whereCondition.name = { [Op.like]: `%${search}%` };
  //     }

  //     // ---------- prioritized vendors ----------
  //     let prioritizedVendors = [];
  //     if (id && Array.isArray(id) && id.length) {
  //       prioritizedVendors = await db.vendorsObj.findAll({
  //         where: { id: { [Op.in]: id } },
  //         include: [
  //           {
  //             model: db.vendorItemObj,
  //             as: "vendorAssigns",
  //              required: false,
  //             include: [
  //               {
  //                 model: db.warehouseItemsObj,
  //                 as: "warehouseItems",
  //               required: false,
  //                 include: [
  //                   {
  //                     model: db.itemObj,
  //                     as: "Item",
  //                     required: false,
                      
  //                   },
  //                 ],
  //               },
  //             ],
  //           },
  //         ],
  //         order: [["id", "DESC"]],
  //       });

  //       whereCondition.id = { [Op.notIn]: id };
  //     }

  //     const include = [
  //       {
  //         model: db.vendorItemObj,
  //         as: "vendorAssigns",
  //         required: false,
  //         include: [
  //           {
  //             model: db.warehouseItemsObj,
  //             as: "warehouseItems",
  //             required: false,
  //             include: [
  //               {
  //                 model: db.itemObj,
  //                 as: "Item",
  //                 required: false,
                 
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     ];

  //     let rows = [];
  //     let count = 0;

  //     // ---------- take all ----------
  //     if (take_all === "all") {
  //       rows = await db.vendorsObj.findAll({
  //         where: whereCondition,
  //         include,
  //         order: [["id", "DESC"]],
  //         ...(limit ? { limit: finalLimit } : {}),
  //       });
  //       count = rows.length;
  //     } else {
  //       const result = await db.vendorsObj.findAndCountAll({
  //         where: whereCondition,
  //         include,
  //         limit: finalLimit,
  //         offset,
  //         order: [["id", "DESC"]],
  //         distinct: true, // IMPORTANT with joins
  //       });

  //       rows = result.rows;
  //       count = result.count;
  //     }

  //     // ---------- merge prioritized first ----------
  //     const finalVendors = [...prioritizedVendors, ...rows];

  //     // ---------- meta ----------
  //     const total = count + prioritizedVendors.length;
  //     const current_count = finalVendors.length;
  //     const loaded_till_now =
  //       take_all === "all"
  //         ? total
  //         : offset + rows.length + prioritizedVendors.length;

  //     return {
  //       data: finalVendors,
  //       meta: {
  //         page: take_all === "all" ? 1 : page,
  //         limit: finalLimit,
  //         current_count,
  //         loaded_till_now,
  //         remaining: Math.max(total - loaded_till_now, 0),
  //         total,
  //         has_more: loaded_till_now < total,
  //       },
  //     };
  //   } catch (e) {
  //     logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //     throw e;
  //   }
  // },

  /*deleteVendors*/
  async deleteVendors(vendorIds) {
    try {

      const ids = Array.isArray(vendorIds) ? vendorIds : [vendorIds];
      let deleteVendor = await db.vendorsObj.destroy({
        where: { id: ids },
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
