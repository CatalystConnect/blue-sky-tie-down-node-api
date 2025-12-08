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
  async getAllVendorsItem({ page, per_page, search, id, take_all }) {
    try {
      let whereCondition = {};


      if (id) {
        whereCondition.vendor_id = id;
      }

      if (search) {
        whereCondition[Op.or] = [
          { vendor_item_number: { [Op.iLike]: `%${search}%` } },
          { vendor_item_description: { [Op.iLike]: `%${search}%` } },
          { currency_code: { [Op.iLike]: `%${search}%` } },
          { purchase_uom: { [Op.iLike]: `%${search}%` } },
        ];
      }


      let limit = parseInt(per_page);
      let offset = (page - 1) * limit;

      if (take_all === "true") {
        limit = null;
        offset = null;
      }

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
          
          }
        ],
        limit,
        offset,
        order: [["created_at", "DESC"]],
      });

      return {
        data: rows,
        meta: {
          total: count,
          page: parseInt(page),
          per_page: parseInt(per_page),
          total_pages: limit ? Math.ceil(count / limit) : 1
        }
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
