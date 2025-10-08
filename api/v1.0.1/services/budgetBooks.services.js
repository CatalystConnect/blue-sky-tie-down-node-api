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
      console.log("DB Insert Error:", error);
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(error));
      throw error;
    }
  },

  async getAllBudgetBooks() {
    try {
      const budgetBooks = await db.budgetBooksObj.findAll({
        order: [["created_at", "DESC"]],
        include: [
          {
            model: db.budgetBooksScopeIncludesObj,
            as: "budgetBooksScopeIncludes",
          },
          { model: db.budgetBooksDrawingsObj, as: "budgetBooksDrawings" },
          { model: db.budgetBooksKeyAreasObj, as: "budgetBooksKeyAreas" },
          { model: db.budgetBooksContractsObj, as: "budgetBooksContracts" },
        ],
      });
      return budgetBooks;
    } catch (error) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(error));
      throw error;
    }
  },

  async getBudgetBooksById(budgetBooksId) {
    try {
      const budgetBook = await db.budgetBooksObj.findOne({
        where: { id: budgetBooksId },
        include: [
          {
            model: db.budgetBooksScopeIncludesObj,
            as: "budgetBooksScopeIncludes",
          },
          { model: db.budgetBooksDrawingsObj, as: "budgetBooksDrawings" },
          { model: db.budgetBooksKeyAreasObj, as: "budgetBooksKeyAreas" },
          { model: db.budgetBooksContractsObj, as: "budgetBooksContracts" },
        ],
      });

      if (!budgetBook) {
        throw new Error("Budget Book not found");
      }

      return budgetBook;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  async updateBudgetBooks(id, postData) {
    try {
      const [updated] = await db.budgetBooksObj.update(postData, {
        where: { id },
      });

      if (!updated) {
        throw new Error("Budget Book not found or update failed.");
      }

      const updatedBudgetBook = await db.budgetBooksObj.findByPk(id);
      return updatedBudgetBook;
    } catch (error) {
      console.log("DB Update Error:", error);
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(error));
      throw error;
    }
  },
  async replaceAssociations(
    budgetBooksId,
    {
      projectScopeIncludes,
      projectSubmittals,
      projectKeyAreas,
      projectContracts,
    }
  ) {
    try {
      await Promise.all([
        db.budgetBooksScopeIncludesObj.destroy({
          where: { budget_books_id: budgetBooksId },
        }),
        db.budgetBooksDrawingsObj.destroy({
          where: { budget_books_id: budgetBooksId },
        }),
        db.budgetBooksKeyAreasObj.destroy({
          where: { budget_books_id: budgetBooksId },
        }),
        db.budgetBooksContractsObj.destroy({
          where: { budget_books_id: budgetBooksId },
        }),
      ]);

      const promises = [];

      if (Array.isArray(projectScopeIncludes) && projectScopeIncludes.length) {
        promises.push(
          db.budgetBooksScopeIncludesObj.bulkCreate(
            projectScopeIncludes.map((item) => ({
              budget_books_id: budgetBooksId,
              budget_category_id: item.budget_category_id,
              is_include: item.is_include,
              is_exclude: item.is_exclude,
            }))
          )
        );
      }

      if (Array.isArray(projectSubmittals) && projectSubmittals.length) {
        promises.push(
          db.budgetBooksDrawingsObj.bulkCreate(
            projectSubmittals.map((item) => ({
              budget_books_id: budgetBooksId,
              submittal_id: item.submittal_id,
              is_include: item.is_include,
            }))
          )
        );
      }

      if (Array.isArray(projectKeyAreas) && projectKeyAreas.length) {
        promises.push(
          db.budgetBooksKeyAreasObj.bulkCreate(
            projectKeyAreas.map((item) => ({
              budget_books_id: budgetBooksId,
              key_area_id: item.key_area_id,
              is_include: item.is_include,
            }))
          )
        );
      }

      if (Array.isArray(projectContracts) && projectContracts.length) {
        promises.push(
          db.budgetBooksContractsObj.bulkCreate(
            projectContracts.map((item) => ({
              budget_books_id: budgetBooksId,
              contract_component_id: item.contract_component_id,
              is_include: item.is_include,
            }))
          )
        );
      }

      await Promise.all(promises);
    } catch (error) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(error));
      throw error;
    }
  },

  async deleteBudgetBooks(budgetBooksId) {
    try {
      const budgetBook = await db.budgetBooksObj.findOne({
        where: { id: budgetBooksId },
      });

      if (!budgetBook) {
        return null;
      }

      await Promise.all([
        db.budgetBooksScopeIncludesObj.destroy({
          where: { budget_books_id: budgetBooksId },
        }),
        db.budgetBooksDrawingsObj.destroy({
          where: { budget_books_id: budgetBooksId },
        }),
        db.budgetBooksKeyAreasObj.destroy({
          where: { budget_books_id: budgetBooksId },
        }),
        db.budgetBooksContractsObj.destroy({
          where: { budget_books_id: budgetBooksId },
        }),
      ]);

      await db.budgetBooksObj.destroy({
        where: { id: budgetBooksId },
      });

      return true;
    } catch (error) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(error));
      throw error;
    }
  },
};
