var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op } = require("sequelize");

module.exports = {

  async addItemLink(postData) {
    try {
      return await db.itemLinksObj.create(postData);
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  async getAllItemLinks({ item_id }) {
    try {
      const where = {};

      if (item_id) {
        where.item_id = item_id;
      }

      const links = await db.itemLinksObj.findAll({
        where,
        attributes: [
          'id',
          'item_id',
          'linked_item_id',
          'type',
          'created_at'
        ],
        include: [
        {
          model: db.itemObj,
          as: 'linkedItem', 
          attributes: ['id', 'sku', 'short_description', 'image', 'status'],  
        }
      ],
        order: [['created_at', 'DESC']],
      });

      // ✅ Group by type
      const grouped = {
        cross_sell: [],
        upsell: [],
        accessory: [],
      };

      links.forEach(link => {
        if (grouped[link.type]) {
          grouped[link.type].push(link);
        }
      });

      return grouped;

    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  async updateItemLinks(id, updateData) {
    try {
      const itemLink = await db.itemLinksObj.findOne({
        where: { id },
      });

      if (!itemLink) return null;

      await itemLink.update(updateData);

      return itemLink;

    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  async deleteItemLinks(id) {
    try {
      const itemLink = await db.itemLinksObj.findOne({
        where: { id },
      });

      if (!itemLink) return null;

      await itemLink.destroy(); 

      return true;

    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  }





};
