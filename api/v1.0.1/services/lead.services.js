var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op, fn, col, where } = require("sequelize");

module.exports = {
  /*getAllLeads*/
  // async getAllLeads(
  //   page,
  //   length,
  //   search,
  //   date,
  //   role_id,
  //   userId,
  //   role,
  //   take_all
  // ) {
  //   try {
  //     const limit = length || 10;
  //     const offset = (page - 1) * limit || 0;

  //     let whereCondition = {};

  //     let queryOptions = {
  //       where: whereCondition,
  //       order: [["id", "DESC"]],
  //       distinct: true,
  //       include: [
  //         {
  //           model: db.userObj,
  //           as: "salesPersons",
  //           attributes: { exclude: ["password"] },
  //         },
  //       ],
  //     };

  //     if (!(take_all && take_all === "all")) {
  //       queryOptions.limit = limit;
  //       queryOptions.offset = offset;
  //     }

  //     let { rows: leads, count } = await db.leadsObj.findAndCountAll(
  //       queryOptions
  //     );

  //     return { leads, count };
  //   } catch (e) {
  //     logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //     throw e;
  //   }
  // },
  async getAllLeads(
    page,
    length,
    search,
    date,
    role_id,
    userId,
    role,
    take_all
  ) {
    try {
      const limit = length || 10;
      const offset = (page - 1) * limit || 0;

      let whereCondition = {};


      if (search) {
        whereCondition = {
          ...whereCondition,
          [Sequelize.Op.or]: [
            { project_id: { [Sequelize.Op.like]: `%${search}%` } },
            { "$company.name$": { [Sequelize.Op.like]: `%${search}%` } },
            { "$contact.full_name$": { [Sequelize.Op.like]: `%${search}%` } }
          ],
        };
      }

      // 📅 Date filter
      if (date) {
        whereCondition.createdAt = {
          [Sequelize.Op.gte]: new Date(date + " 00:00:00"),
          [Sequelize.Op.lte]: new Date(date + " 23:59:59"),
        };
      }

      let queryOptions = {
        where: whereCondition,
        order: [["id", "DESC"]],
        distinct: true,
        include: [
          { model: db.companyObj, as: "company" },
          { model: db.contactsObj, as: "contact" },
          { model: db.userObj, as: "salesPerson", attributes: { exclude: ["password"] } },
          { model: db.userObj, as: "engineer", attributes: { exclude: ["password"] } },
          { model: db.leadTeamsObj, as: "leadTeam" },
          { model: db.leadStatusesObj, as: "leadStatus" }
        ]
      };

      if (!(take_all && take_all === "all")) {
        queryOptions.limit = limit;
        queryOptions.offset = offset;
      }

      let { rows: leads, count } = await db.leadsObj.findAndCountAll(queryOptions);

      

      // 📊 Pagination meta
      let lastPage = Math.ceil(count / limit);
      let from = offset + 1;
      let to = offset + leads.length;

      return {
        leads,
        meta: {
          current_page: page,
          from: from,
          to: to,
          last_page: lastPage,
          per_page: limit,
          total: count,
        },
      };
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*addLead*/
  async addLead(postData) {
    try {
      let lead = await db.leadsObj.create(postData);
      return lead;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*getLeadById*/
  async getLeadById(leadId) {
    try {
      const lead = await db.leadsObj.findOne({
        where: { id: leadId },
        include: [
          { model: db.companyObj, as: "company" },
          { model: db.contactsObj, as: "contact" },
          { model: db.userObj, as: "salesPerson", attributes: { exclude: ["password"] } },
          { model: db.userObj, as: "engineer", attributes: { exclude: ["password"] } },
          { model: db.leadTeamsObj, as: "leadTeam" },
          { model: db.leadStatusesObj, as: "leadStatus" }
        ]
      });
      return lead;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*leadUpdate*/
  async leadUpdate(data, leadId) {
    try {
      const lead = await db.leadsObj.update(data, {
        where: { id: leadId },
      });
      return lead;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*leadDelete*/
  async leadDelete(leadId) {
    try {
      let leads = await db.leadsObj.destroy({
        where: { id: leadId },
      });
      return leads;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
