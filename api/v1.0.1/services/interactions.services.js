var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op } = require("sequelize");

module.exports = {
  /*addInteractions*/
  async addInteractions(postData) {
    try {
      let interactions = await db.interactionsObj.create(postData);
      return interactions;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  async getAllinteractionByLeadId(leadId) {
    try {
      const interactions = await db.interactionsObj.findAll({
        where: { lead_id: leadId },
        include: [
          {
            model: db.userObj,
            as: "userInteractions",
            attributes: ["id", "first_name", "last_name", "email"],
          },
          {
            model: db.contactsObj,
            as: "contactInteractions",
            attributes: ["id", "name", "email", "phone"],
          },
          {
            model: db.interactionTypesObj,
            as: "interactionTypes",
            attributes: ["id", "name"],
          },
        ],
        order: [["date", "DESC"]],
      });

      return interactions;
    } catch (error) {
      throw error;
    }
  },
};
