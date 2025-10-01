var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op, fn, col, where } = require("sequelize");

module.exports = {
  /*addProject*/
  async addProject(postData) {
    try {
      let addProject = await db.projectObj.create(postData);
      return addProject;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*getAllProject*/
  async getAllProject(page = 1, length = 10, search = "") {
    try {
      const limit = parseInt(length) || 10;
      const offset = (parseInt(page) - 1) * limit || 0;

      const whereClause = {};
      if (search) {
        whereClause.name = { [db.Sequelize.Op.like]: `%${search}%` };
      }

      const { rows, count } = await db.projectObj.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        attributes: [
          "id",
          "user_id",
          "site_plan_id",
          "engineer_id",
          "name",
          "city",
          "state",
          "plan_date",
          "bldg_gsqft",
          "address",
          "zip",
          "units",
          "projectType",
          "project_phase",
          "date_received",
          "rev_status",
          "plan_reviewed_date",
          "plan_reviewed_by",
          "plan_revision_notes",
          "data_collocated_date",
          "bldgs",
          "wind_zone",
          "seismic_zone",
          "developer_id",
          "general_contractor_id",
          "assign_to_budget",
          "take_off_team_id",
          "take_off_type",
          "take_off_scope",
          "assign_date",
          "plan_link",
          "submissionType",
          "planFiles",
          "projectTags",
          "projectFiles",
          "architecture",
          "takeoffactualtime",
          "dueDate",
          "projectAttachmentUrls",
          "attachmentsLink",
          "projectRifFields",
        ],
        include: [
          { model: db.companyObj, as: "engineer" },
          { model: db.companyObj, as: "architect" },
          { model: db.companyObj, as: "developer" },
          { model: db.companyObj, as: "general_contractor" },
          { model: db.userObj, as: "planReviewer" },
          { model: db.projectplanSetsObj, as: "planSets" },
        ],
        order: [["id", "DESC"]],
      });

      return {
        data: rows,
        meta: {
          current_page: parseInt(page),
          from: offset + 1,
          to: offset + rows.length,
          last_page: Math.ceil(count / limit),
          per_page: limit,
          total: count,
        },
      };
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  // /*getProjectById*/
  async getProjectById(projectId) {
    try {
      let getProjectById = await db.projectObj.findOne({
        where: { id: projectId },
        attributes: [
          "id",
          "user_id",
          "site_plan_id",
          "engineer_id",
          "name",
          "city",
          "state",
          "plan_date",
          "bldg_gsqft",
          "address",
          "zip",
          "units",
          "projectType",
          "project_phase",
          "date_received",
          "rev_status",
          "plan_reviewed_date",
          "plan_reviewed_by",
          "plan_revision_notes",
          "data_collocated_date",
          "bldgs",
          "wind_zone",
          "seismic_zone",
          "developer_id",
          "general_contractor_id",
          "assign_to_budget",
          "take_off_team_id",
          "take_off_type",
          "take_off_scope",
          "assign_date",
          "plan_link",
          "submissionType",
          "planFiles",
          "projectTags",
          "projectFiles",
          "architecture",
          "takeoffactualtime",
          "dueDate",
          "projectAttachmentUrls",
          "attachmentsLink",
          "projectRifFields",
        ],
        include: [
          { model: db.companyObj, as: "engineer" },
          { model: db.companyObj, as: "architect" },
          { model: db.companyObj, as: "developer" },
          { model: db.companyObj, as: "general_contractor" },
          { model: db.userObj, as: "planReviewer" },
          { model: db.projectplanSetsObj, as: "planSets" },
          { model: db.leadsObj, as: "project_leads" },
        ],
      });
      return getProjectById;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  // /*updateProject*/
  async updateProject(data, projectId) {
    try {
      let updateProject = await db.projectObj.update(data, {
        where: { id: projectId },
      });
      return updateProject;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  // /*deleteProject*/
  async deleteProject(projectId) {
    try {
      let deleteProject = await db.projectObj.destroy({
        where: { id: projectId },
      });
      return deleteProject;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  async projectplanSets(postData) {
    try {
      let projectplanSets = await db.projectplanSetsObj.create(postData);
      return projectplanSets;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*addProjectNotes*/
  async addProjectNotes(postData) {
    try {
      const addProjectNotes = await db.projectNotesObj.create(postData);
      return addProjectNotes;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  async listProjectNotes(projectId, limit) {
    try {
      return await db.projectNotesObj.findAll({
        where: { project_id: projectId },
        order: [["created_at", "DESC"]],
        limit: limit,
      });
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  // Update Project Note
  async updateProjectNotes(projectNoteId, notes) {
    try {
      const [updated] = await db.projectNotesObj.update(
        { notes: notes },
        { where: { id: projectNoteId } }
      );

      if (updated === 0) return null;

      return await db.projectNotesObj.findByPk(projectNoteId);
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  // Delete Project Notes
  async deleteProjectNotes(projectNoteId) {
    try {
      const deleted = await db.projectNotesObj.destroy({
        where: { id: projectNoteId },
      });
      return deleted > 0;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
