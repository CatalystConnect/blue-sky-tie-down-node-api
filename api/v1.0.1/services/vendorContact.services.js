var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op } = require("sequelize");

module.exports = {
  /*addVendorsContact*/
  async addVendorsContact(postData) {
    try {
      let vendor = await db.vendorContactObj.create(postData);
      return vendor;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*getVendorsContactById*/
  async getVendorsContactById(vendorId) {
    try {
      let vendors = await db.vendorContactObj.findOne({
        where: { id: vendorId },
      });
      return vendors;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  // /*getAllVendorsContact*/
  async getAllVendorsContact({ page, per_page, search, id, take_all }) {
    try {
      let whereCondition = {};


      if (id) {
        whereCondition.vendor_id = id;
      }

      if (search) {
        whereCondition[Op.or] = [
          { first_name: { [Op.iLike]: `%${search}%` } },
          { last_name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } }
        ];
      }


      let limit = parseInt(per_page);
      let offset = (page - 1) * limit;

      if (take_all === "true") {
        limit = null;
        offset = null;
      }

      const { rows, count } = await db.vendorContactObj.findAndCountAll({
        where: whereCondition,
        include:[
          {
            model: db.vendorsObj,
            as: "vendorContacts"
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

  // /*deleteVendorsContact*/
  async deleteVendorsContact(vendorId) {
    try {
      let deleteVendor = await db.vendorContactObj.destroy({
        where: { id: vendorId },
      });
      return deleteVendor;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  // // /*updateVendorsContact*/
  async updateVendorsContact(data, vendorId) {
    try {
      let vendors = await db.vendorContactObj.update(data, {
        where: { id: vendorId },
      });
      return vendors;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
