var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op } = require("sequelize");

module.exports = {
  /*addVendorsItem*/
  async addVendorsItem(postData) {
    try {
      let vendor = await db.vendorItemObj.create(postData);
      return vendor;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*getVendorsItemById*/
  async getVendorsItemById(vendorItemId) {
    try {
      let vendors = await db.vendorItemObj.findOne({
        where: { id: vendorItemId },
      });
      return vendors;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  // /*getAllVendorsItem*/
  // async getAllVendorsItem({ page, per_page, search, id, take_all }) {
  //   try {
  //     let whereCondition = {};


  //     if (id) {
  //       whereCondition.vendor_id = id;
  //     }

  //     if (search) {
  //       whereCondition[Op.or] = [
  //         { vendor_item_number: { [Op.iLike]: `%${search}%` } },
  //         { vendor_item_description: { [Op.iLike]: `%${search}%` } },
  //         { currency_code: { [Op.iLike]: `%${search}%` } },
  //         { purchase_uom: { [Op.iLike]: `%${search}%` } },
  //       ];
  //     }


  //     let limit = parseInt(per_page);
  //     let offset = (page - 1) * limit;

  //     if (take_all === "true") {
  //       limit = null;
  //       offset = null;
  //     }

  //     const { rows, count } = await db.vendorItemObj.findAndCountAll({
  //       where: whereCondition,
  //       include: [
  //         {
  //           model: db.itemObj,
  //           as: "item",
  //         },
  //         {
  //           model: db.vendorsObj,
  //           as: "vendors",

  //         }
  //       ],
  //       limit,
  //       offset,
  //       order: [["created_at", "DESC"]],
  //     });

  //     return {
  //       data: rows,
  //       meta: {
  //         total: count,
  //         page: parseInt(page),
  //         per_page: parseInt(per_page),
  //         total_pages: limit ? Math.ceil(count / limit) : 1
  //       }
  //     };
  //   } catch (e) {
  //     logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //     throw e;
  //   }
  // },
  async getAllVendorsItem({ page, per_page, search, id, take_all }) {
    try {
      let whereCondition = {};

      // ---------- vendor filter (same) ----------
      if (id) {
        whereCondition.vendor_id = id;
      }

      // ---------- search (same) ----------
      if (search) {
        whereCondition[Op.or] = [
          { vendor_item_number: { [Op.iLike]: `%${search}%` } },
          { vendor_item_description: { [Op.iLike]: `%${search}%` } },
          { currency_code: { [Op.iLike]: `%${search}%` } },
          { purchase_uom: { [Op.iLike]: `%${search}%` } },
        ];
      }

      // ---------- pagination setup (same) ----------
      const limit = parseInt(per_page) || 10;
      const currentPage = parseInt(page) || 1;
      const offset = (currentPage - 1) * limit;

      let queryLimit = limit;
      let queryOffset = offset;

      if (take_all === "true") {
        queryLimit = null;
        queryOffset = null;
      }

      // ---------- DB query (same) ----------
      const { rows, count } = await db.vendorItemObj.findAndCountAll({
        where: whereCondition,
        include: [
          {
            model: db.itemObj,
            as: "item",
          },
          {
            model: db.vendorsObj,
            as: "vendors",
          },
        ],
        limit: queryLimit,
        offset: queryOffset,
        order: [["created_at", "DESC"]],
      });

      // ---------- LAZY LOAD META (NEW, SAFE) ----------
      const total = count;
      const current_count = rows.length;
      const loaded_till_now =
        take_all === "true" ? total : offset + current_count;
      const remaining = Math.max(total - loaded_till_now, 0);
      const has_more = loaded_till_now < total;

      return {
        data: rows,
        meta: {
          page: take_all === "true" ? 1 : currentPage,
          limit,
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


  // /*deleteVendorsItem*/
  async deleteVendorsItem(vendorItemId) {
    try {
      let deleteVendor = await db.vendorItemObj.destroy({
        where: { id: vendorItemId },
      });
      return deleteVendor;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  // // /*updateVendorsItem*/
  async updateVendorsItem(data, vendorItemId) {
    try {
      let vendors = await db.vendorItemObj.update(data, {
        where: { id: vendorItemId },
      });
      return vendors;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
