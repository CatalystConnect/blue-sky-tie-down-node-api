var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op } = require("sequelize");

module.exports = {
  /*addVendorsAddress*/
  async addVendorsAddress(postData) {
    try {
      let vendor = await db.vendorAddressObj.create(postData);
      return vendor;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*getVendorsAddressById*/
  async getVendorsAddressById(vendorId) {
    try {
      let vendors = await db.vendorAddressObj.findOne({
        where: { id: vendorId },
      });
      return vendors;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*getAllVendorsAddress*/
  // async getAllVendorsAddress({ page, per_page, search, id, take_all }) {
  //   try {
  //     let whereCondition = {};


  //     if (id) {
  //       whereCondition.vendor_id = id;
  //     }

  //     if (search) {
  //       whereCondition[Op.or] = [
  //         { street_1: { [Op.iLike]: `%${search}%` } },
  //         { state: { [Op.iLike]: `%${search}%` } },
  //         { postal_code: { [Op.iLike]: `%${search}%` } }
  //       ];
  //     }


  //     let limit = parseInt(per_page);
  //     let offset = (page - 1) * limit;

  //     if (take_all === "true") {
  //       limit = null;
  //       offset = null;
  //     }

  //     const { rows, count } = await db.vendorAddressObj.findAndCountAll({
  //       where: whereCondition,
  //       include:[
  //         {
  //           model: db.vendorsObj,
  //           as: "vendorAddresses"
  //           }
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
  async getAllVendorsAddress({ page, per_page, search, id, take_all }) {
    try {
      page = Math.max(parseInt(page) || 1, 1);
      let limit = Math.max(parseInt(per_page) || 10, 1);
      let offset = (page - 1) * limit;

      let whereCondition = {};

      // ---------- filters (same) ----------
      if (id) {
        whereCondition.vendor_id = id;
      }

      if (search) {
        whereCondition[Op.or] = [
          { street_1: { [Op.iLike]: `%${search}%` } },
          { state: { [Op.iLike]: `%${search}%` } },
          { postal_code: { [Op.iLike]: `%${search}%` } }
        ];
      }

      // ---------- take all (same) ----------
      if (take_all === "true") {
        limit = null;
        offset = null;
      }

      // ---------- DB query (same) ----------
      const { rows, count } = await db.vendorAddressObj.findAndCountAll({
        where: whereCondition,
        include: [
          {
            model: db.vendorsObj,
            as: "vendorAddresses"
          }
        ],
        limit,
        offset,
        order: [["created_at", "DESC"]],
      });

      // ---------- LAZY LOAD META ----------
      const total = count;
      const current_count = rows.length;
      const loaded_till_now =
        offset !== null ? offset + current_count : current_count;
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
  /*deleteVendorsAddress*/
  async deleteVendorsAddress(vendorId) {
    try {
      let deleteVendor = await db.vendorAddressObj.destroy({
        where: { id: vendorId },
      });
      return deleteVendor;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  // /*updateVendorsAddress*/
  async updateVendorsAddress(data, vendorId) {
    try {
      let vendors = await db.vendorAddressObj.update(data, {
        where: { id: vendorId },
      });
      return vendors;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
