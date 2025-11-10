var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op, Sequelize } = require("sequelize");

module.exports = {
  /*addCompany*/
  async addCompany(postData) {
    try {
      let company = await db.companyObj.create(postData);
      return company;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  //   /* Get company by Name (for validation) */
  async getCompanyByName(name) {
    try {
      return await db.companyObj.findOne({ where: { name } });
    } catch (e) {
      console.error("getCompanyByName Error:", e.message); // replaced logger
      throw e;
    }
  },

  /*get all Company*/
  // async getAllCompany(query) {
  //   try {
  //     let { page, per_page, limit, take_all, search, id } = query;

  //     page = parseInt(page) || 1;
  //     per_page = parseInt(per_page) || 10;
  //     limit = parseInt(limit) || null;
  //     const offset = (page - 1) * per_page;

  //     let whereCondition = {};
  //     if (search) {
  //       whereCondition = {
  //         name: {
  //           [Op.like]: `%${search}%`,
  //         },
  //       };
  //     }

  //     let order = [["id", "DESC"]];
  //     if (id) {
  //       order = [
  //         [
  //           Sequelize.literal(
  //             `CASE WHEN id = ${parseInt(id)} THEN 0 ELSE 1 END`
  //           ),
  //           "ASC",
  //         ],
  //         ["id", "DESC"],
  //       ];
  //     }

  //      const includeRelation = [
  //     {
  //       model: db.companyTypeObj,
  //       as: "companyType",

  //     },
  //   ];

  //     if (take_all === "all") {
  //       const companies = await db.companyObj.findAll({
  //         where: whereCondition,
  //         order: order,
  //         ...(limit ? { limit } : {}),
  //       });
  //       return { data: companies, total: companies.length };
  //     }

  //     const { rows, count } = await db.companyObj.findAndCountAll({
  //       where: whereCondition,
  //       order: order,
  //       limit: per_page,
  //       offset: offset,
  //       include: includeRelation,
  //     });

  //     return {
  //       data: rows,
  //       total: count,
  //       current_page: page,
  //       per_page: per_page,
  //       last_page: Math.ceil(count / per_page),
  //     };
  //   } catch (e) {
  //     console.error(commonHelper.customizeCatchMsg(e));
  //     throw e;
  //   }
  // },

  async getAllCompany(query) {
    try {
      let { page, per_page, limit, take_all, search, id, type } = query;

      page = parseInt(page) || 1;
      per_page = parseInt(per_page) || 10;
      limit = parseInt(limit) || null;
      const offset = (page - 1) * per_page;

      let whereCondition = {};
      if (search) {
        whereCondition.name = { [Op.iLike]: `%${search}%` };
      }

      let order = [["id", "DESC"]];
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

      const includeRelation = [
        {
          model: db.companyTypeObj,
          as: "companyType",
          ...(type
            ? {
                where: {
                  [Op.or]: Sequelize.where(
                    Sequelize.fn("LOWER", Sequelize.col("companyType.name")),
                    {
                      [Op.like]: `%${type.toLowerCase()}%`,
                    }
                  ),
                },
                required: true,
              }
            : {
                required: false,
              }),
        },
      ];
      if (take_all === "all") {
        const companies = await db.companyObj.findAll({
          where: whereCondition,
          order,
          ...(limit ? { limit } : {}),
          include: includeRelation,
        });

        return { data: companies, total: companies.length };
      }

      const { rows, count } = await db.companyObj.findAndCountAll({
        where: whereCondition,
        order,
        limit: per_page,
        offset,
        include: includeRelation,
      });

      return {
        data: rows,
        total: count,
        current_page: page,
        per_page,
        last_page: Math.ceil(count / per_page),
      };
    } catch (e) {
      console.error(commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*get by id Company*/
  async getCompanyById(id) {
    try {
      return await db.companyObj.findOne({
        where: { id: id },
      });
    } catch (e) {
      logger.error(commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*update by id Company*/
  async updateCompany(id, updatedData) {
    try {
      const company = await db.companyObj.findByPk(id);

      if (!company) {
        return null;
      }

      await company.update(updatedData);
      return company;
    } catch (e) {
      console.error("Service Update Company Error:", e.message);
      throw e;
    }
  },

  /*delete by id Company*/
  async deleteCompany(id) {
    try {
      const company = await db.companyObj.findByPk(id);

      if (!company) {
        return false;
      }

      await company.destroy();
      return true;
    } catch (e) {
      logger.error(commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
