var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op, Sequelize } = require("sequelize");

module.exports = {
  /*addBudgetBooks*/
  async addBudgetBooks(postData) {
    try {
      const budgetBook = await db.budgetBooksObj.create(postData);

      return budgetBook;
    } catch (error) {
      console.log("❌ DB Insert Error:", error);
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(error));
      throw error;
    }
  },

  // async getAllBudgetBooks() {
  //   try {
  //     const budgetBooks = await db.budgetBooksObj.findAll({
  //       order: [["created_at", "DESC"]],
  //       // Optional: include related tables if you want
  //       include: [
  //         { model: db.projectScopeIncludesObj, as: "projectScopeIncludes" },
  //         { model: db.projectDrawingsObj, as: "projectSubmittals" },
  //         { model: db.projectKeyAreasObj, as: "projectKeyAreas" },
  //         { model: db.projectContractsObj, as: "projectContracts" },
  //       ],
  //     });
  //     return budgetBooks;
  //   } catch (error) {
  //     logger.errorLog.log("error", commonHelper.customizeCatchMsg(error));
  //     throw error;
  //   }
  // }
  
};
