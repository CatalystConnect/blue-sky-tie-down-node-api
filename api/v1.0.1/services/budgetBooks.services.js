var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op, Sequelize } = require("sequelize");

module.exports = {
  /*addBudgetBooks*/
  async addBudgetBooks(postData) {
    try {
      let budgetBooks = await db.budgetBooksObj.create(postData);
      return budgetBooks;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
