var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op } = require("sequelize");

module.exports = {
  /*addLeadTeams*/
  async addLeadTeams(postData) {
    try {
      let leadTeams = await db.leadTeamsObj.create(postData);
      return leadTeams;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*getAllLeadTeams*/
  async getAllLeadTeams({ page, limit, search }) {
    try {
      const offset = (page - 1) * limit;

      const whereCondition = {};
      if (search) {
        whereCondition[Op.or] = [{ name: { [Op.iLike]: `%${search}%` } }];
      }

      const { rows, count } = await db.leadTeamsObj.findAndCountAll({
        where: whereCondition,
        order: [["id", "ASC"]],
        limit,
        offset,
      });

      // Fetch users for each team manually
      for (const team of rows) {
        let contactIds = [];
        try {
          contactIds = JSON.parse(team.contact_id || "[]");
        } catch (e) {
          contactIds = [];
        }

        if (contactIds.length > 0) {
          const users = await db.userObj.findAll({
            where: { id: contactIds },
            attributes: { exclude: ["password"] },
          });
          team.dataValues.contactDetails = users;
        } else {
          team.dataValues.contactDetails = [];
        }
      }

      // Calculate pagination metadata
      const lastPage = Math.ceil(count / limit);
      const from = count > 0 ? offset + 1 : 0;
      const to = offset + rows.length;

      return {
        data: rows,
        meta: {
          current_page: page,
          from: from,
          to: to,
          per_page: limit,
          last_page: lastPage,
          total: count,
        },
      };
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*getLeadTeamsById*/
  async getLeadTeamsById(id) {
    try {
      const team = await db.leadTeamsObj.findOne({
        where: { id },
      });

      if (!team) {
        throw new Error("Lead team not found");
      }

      // Parse contact IDs and fetch users
      let contactIds = [];
      try {
        contactIds = JSON.parse(team.contact_id || "[]");
      } catch (e) {
        contactIds = [];
      }

      if (contactIds.length > 0) {
        const users = await db.userObj.findAll({
          where: { id: contactIds },
          attributes: { exclude: ["password"] },
        });
        team.dataValues.contactDetails = users;
      } else {
        team.dataValues.contactDetails = [];
      }

      return team;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*deleteLeadTeams*/
  async deleteLeadTeams(id) {
    try {
      const leadTeams = await db.leadTeamsObj.findOne({ where: { id } });
      if (!leadTeams) {
        throw new Error("Lead team not found");
      }

      // Soft delete
      await leadTeams.destroy();

      return true;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*updateLeadTeams*/
  async updateLeadTeams(id, postData) {
    try {
      const leadTeams = await db.leadTeamsObj.findOne({
        where: { id: parseInt(id) },
      });
      if (!leadTeams) throw new Error("Lead team not found");

      const updated = await leadTeams.update(postData);
      return updated;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
