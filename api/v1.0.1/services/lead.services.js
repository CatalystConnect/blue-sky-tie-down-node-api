var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op, fn, col, where } = require("sequelize");

module.exports = {
  /*getAllLeads*/
  async getAllLeads(
    page,
    per_page,
    search,
    date,
    role_id,
    userId,
    role,
    take_all
  ) {
    try {
      const limit = per_page || 10;
      const offset = (page - 1) * limit || 0;

      let whereCondition = {};

      if (search) {
        whereCondition = {
          ...whereCondition,
          [Sequelize.Op.or]: [
            { project_id: { [Sequelize.Op.like]: `%${search}%` } },
            { "$company.name$": { [Sequelize.Op.like]: `%${search}%` } },
            { "$contact.full_name$": { [Sequelize.Op.like]: `%${search}%` } },
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
          {
            model: db.userObj,
            as: "salePerson",
            attributes: { exclude: ["password"] },
          },
          {
            model: db.userObj,
            as: "engineer",
            attributes: { exclude: ["password"] },
          },
          { model: db.leadTeamsObj, as: "leadTeam" },
          { model: db.leadStatusesObj, as: "leadStatus" },
          { model: db.projectObj, as: "project" },
          {
            model: db.leadTagsObj,
            as: "lead_tags",
            include: [
              {
                model: db.tagsObj,
                as: "tag",
              },
            ],
          },
        ],
      };

      if (!(take_all && take_all === "all")) {
        queryOptions.limit = limit;
        queryOptions.offset = offset;
      }

      let { rows: leads, count } = await db.leadsObj.findAndCountAll(
        queryOptions
      );

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
          {
            model: db.userObj,
            as: "salePerson",
            attributes: { exclude: ["password"] },
          },
          {
            model: db.userObj,
            as: "engineer",
            attributes: { exclude: ["password"] },
          },
          { model: db.leadTeamsObj, as: "leadTeam" },
          { model: db.leadStatusesObj, as: "leadStatus" },
          { model: db.projectObj, as: "project" },
          {
            model: db.leadTagsObj,
            as: "lead_tags",
            include: [
              {
                model: db.tagsObj,
                as: "tag",
              },
            ],
          },
          {
            model: db.leadTeamsMemberObj,
            as: "leadTeamMembers",
            include: [
              {
                model: db.userObj,
                as: "user",
                attributes: { exclude: ["password"] },
              },
            ],
          },
        ],
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

  /*setDefaultLead*/
  async setDefaultLead(leadId, isDefaultLead) {
    try {
      if (isDefaultLead === "true" || isDefaultLead === true) {
        await db.leadsObj.update({ isDefaultLead: false }, { where: {} });
        await db.leadsObj.update(
          { isDefaultLead: true },
          { where: { id: leadId } }
        );
      } else {
        await db.leadsObj.update(
          { isDefaultLead: false },
          { where: { id: leadId } }
        );
      }
      return await db.leadsObj.findByPk(leadId);
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*getAllLeadNotes*/
  async getAllLeadNotes(page, per_page, search, date, lead_id, take_all) {
    try {
      const limit = per_page || 10;
      const offset = (page - 1) * limit || 0;

      let whereCondition = { lead_id: lead_id };

      if (search) {
        whereCondition.notes = { [Sequelize.Op.like]: `%${search}%` };
      }

      if (date) {
        whereCondition.created_at = {
          [Sequelize.Op.gte]: new Date(date + " 00:00:00"),
          [Sequelize.Op.lte]: new Date(date + " 23:59:59"),
        };
      }

      let queryOptions = {
        where: whereCondition,
        order: [["id", "DESC"]],
        distinct: true,
      };

      if (!(take_all && take_all === "all")) {
        queryOptions.limit = limit;
        queryOptions.offset = offset;
      }

      let { rows: notes, count } = await db.leadNotesObj.findAndCountAll(
        queryOptions
      );

      let lastPage = Math.ceil(count / limit);
      let from = offset + 1;
      let to = offset + notes.length;

      return {
        notes,
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

  /*addLeadtNotes*/
  async addLeadtNotes(postData) {
    try {
      const addLeadtNotes = await db.leadNotesObj.create(postData);
      return addLeadtNotes;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  async updateLeadNotes(leadNoteId, notes) {
    try {
      const [updated] = await db.leadNotesObj.update(
        { notes: notes },
        { where: { id: leadNoteId } }
      );

      if (updated === 0) return null;

      return await db.leadNotesObj.findByPk(leadNoteId);
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  // // Delete Project Notes
  async deleteLeadNotes(leadNoteId) {
    try {
      const deleted = await db.leadNotesObj.destroy({
        where: { id: leadNoteId },
      });
      return deleted > 0;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /* updateLeadTeamMember */
  async updateLeadTeamMember(members, leadId) {
    try {
      await db.leadTeamsMemberObj.destroy({ where: { lead_id: leadId } });

      const newMembers = members.map((userId) => ({
        lead_id: leadId,
        user_id: userId,
      }));

      await db.leadTeamsMemberObj.bulkCreate(newMembers);

      return await db.leadTeamsMemberObj.findAll({
        where: { lead_id: leadId },
        // include: [
        //   {
        //     model: db.userObj,
        //     as: "user",
        //     attributes: ["id", "full_name", "email"],
        //   },
        // ],
      });
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /* getLeadTeamMembers */
  async getLeadTeamMembers(leadId) {
    try {
      return await db.leadTeamsMemberObj.findAll({
        where: { lead_id: leadId },
        include: [
          {
            model: db.userObj,
            as: "user",
            attributes: { exclude: ["password"] },
          },
        ],
      });
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
