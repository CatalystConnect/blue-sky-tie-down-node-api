var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op, Sequelize } = require("sequelize");

module.exports = {
  /*addCompany*/
  async addCompanyType(postData) {
    try {
      let company = await db.companyTypeObj.create(postData);
      return company;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  //   /* Get company by Name (for validation) */
  async getCompanyTypeByName(name) {
    try {
      return await db.companyTypeObj.findOne({ where: { name } });
    } catch (e) {
      console.error("getCompanyTypeByName Error:", e.message); // replaced logger
      throw e;
    }
  },

  /*get all Company*/
  async getAllCompanyType(query) {
    try {
      let { page, per_page, limit, take_all, search, id } = query;

      page = parseInt(page) || 1;
      per_page = parseInt(per_page) || 10;
      limit = parseInt(limit) || null;
      const offset = (page - 1) * per_page;

      let whereCondition = {};
      if (search) {
        whereCondition = {
          name: {
            [Op.like]: `%${search}%`,
          },
        };
      }

      let order = [["sort_order", "ASC"]];
      if (id) {
        order = [
          [
            Sequelize.literal(
              `CASE WHEN id = ${parseInt(id)} THEN 0 ELSE 1 END`
            ),
            "ASC",
          ],
          ["id", "DESC"],
        ];
      }

      if (take_all === "all") {
        const companies = await db.companyTypeObj.findAll({
          where: whereCondition,
          order: order,
          ...(limit ? { limit } : {}),
        });
        return { data: companies, total: companies.length };
      }

      const { rows, count } = await db.companyTypeObj.findAndCountAll({
        where: whereCondition,
        order: order,
        limit: per_page,
        offset: offset,
      });

      return {
        data: rows,
        total: count,
        current_page: page,
        per_page: per_page,
        last_page: Math.ceil(count / per_page),
      };
    } catch (e) {
      console.error(commonHelper.customizeCatchMsg(e)); // safer than logger.error
      throw e;
    }
  },

  /*get by id Company*/
  async getCompanyTypeById(id) {
    try {
      return await db.companyTypeObj.findOne({
        where: { id: id },
      });
    } catch (e) {
      logger.error(commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*update by id Company*/
  async updateCompanyType(id, updatedData) {
    try {
      const companyType = await db.companyTypeObj.findByPk(id);

      if (!companyType) {
        return null;
      }

      await companyType.update(updatedData);
      return companyType;
    } catch (e) {
      console.error("Service Update Company Error:", e.message);
      throw e;
    }
  },

  /*delete by id Company*/
  async deleteCompanyType(id) {
    try {
      const companyType = await db.companyTypeObj.findByPk(id);

      if (!companyType) {
        return false;
      }

      await companyType.destroy();
      return true;
    } catch (e) {
      logger.error(commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
