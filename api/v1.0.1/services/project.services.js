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
  async getAllProject(page = 1, per_page = 10, search = "") {
    try {
      const limit = parseInt(per_page) || 10;
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
          "project_tags",
          "projectFiles",
          "architecture",
          "takeoffactualtime",
          "dueDate",
          "projectAttachmentUrls",
          "attachmentsLink",
          "projectRifFields",
          "takeofCompleteDate",
          "connectplan",
          "surveyorNotes",
          "completedFiles",
          "takeOfEstimateTime",
          "takeoff_status",
          "project_status",
          "priority",
          "takeoffStartDate",
          "takeoffDueDate"
        ],
        include: [
          { model: db.companyObj, as: "engineer" },
          { model: db.companyObj, as: "architect" },
          { model: db.companyObj, as: "developer" },
          { model: db.companyObj, as: "general_contractor" },
          { model: db.userObj, as: "planReviewer" },
          { model: db.projectplanSetsObj, as: "planSets",include:[
            { model: db.userObj, as: "planReviewerUers" },
          ]},
          { model: db.leadTeamsObj, as: "takeoff_team" },
          {
            model: db.taxesObj,
            as: "zipCodeDetails",
          },
          {
            model: db.taxesObj,
            as: "stateDetails",
          },
          {
            model: db.stateObj,
            as: "states",
          },
          {
            model: db.projectPhasesObj,
            as: "projectPhase",
          },
          {
            model: db.projectTagsObj,
            as: "projectTag",
          },
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
          "project_tags",
          "projectFiles",
          "architecture",
          "takeoffactualtime",
          "dueDate",
          "projectAttachmentUrls",
          "attachmentsLink",
          "projectRifFields",
          "takeofCompleteDate",
          "connectplan",
          "surveyorNotes",
          "completedFiles",
          "takeOfEstimateTime",
          "takeoff_status",
          "project_status",
          "priority",
           "takeoffStartDate",
          "takeoffDueDate"
        ],
        include: [
          { model: db.companyObj, as: "engineer" },
          { model: db.companyObj, as: "architect" },
          { model: db.companyObj, as: "developer" },
          { model: db.companyObj, as: "general_contractor" },
          { model: db.userObj, as: "planReviewer" },
          { model: db.leadTeamsObj, as: "takeoff_team" },
          { model: db.projectplanSetsObj, as: "planSets",include:[
            { model: db.userObj, as: "planReviewerUers" },
          ]},
          {
            model: db.taxesObj,
            as: "zipCodeDetails",
          },
          {
            model: db.taxesObj,
            as: "stateDetails",
          },
          {
            model: db.stateObj,
            as: "states",
          },
          {
            model: db.projectPhasesObj,
            as: "projectPhase",
          },
          {
            model: db.projectTagsObj,
            as: "projectTag",
          },
          {
            model: db.leadsObj,
            as: "project_leads",
            include: [
              { model: db.companyObj, as: "lead_engineer" },
              { model: db.contactsObj, as: "lead_contact" },
              { model: db.companyObj, as: "lead_company" },
              { model: db.userObj, as: "lead_sales_person" },
              {
                model: db.leadStatusesObj,
                as: "leadStatus",
              },
              {
                model: db.projectObj,
                as: "project",
              },
            ],
          },
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

  async listProjectNotes(projectId, page, per_page) {
    try {
      const offset = (page - 1) * per_page;

      const { count, rows } = await db.projectNotesObj.findAndCountAll({
        where: { project_id: projectId },
        order: [["created_at", "DESC"]],
        limit: per_page,
        offset: offset,
        include: [
          {
            model: db.userObj,
            as: "user",
            attributes: ["id", "name", "email", "phone"],
          },
        ],
      });

      return {
        data: rows,
        meta: {
          current_page: parseInt(page),
          from: offset + 1,
          to: offset + rows.length,
          last_page: Math.ceil(count / per_page),
          per_page: per_page,
          total: count,
        },
      };
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
  async getProjectPlanSet(filters) {
    try {
      const whereClause = { project_id: filters.project_id };

      if (filters.id) {
        whereClause.id = filters.id;
      }

      if (filters.search) {
        whereClause[Op.or] = [
          { plan_link: { [Op.like]: `%${filters.search}%` } },
          { submissionType: { [Op.like]: `%${filters.search}%` } },
          { plan_revision_notes: { [Op.like]: `%${filters.search}%` } },
        ];
      }

      const page = filters.page ? parseInt(filters.page) : 1;
      const per_page = filters.per_page ? parseInt(filters.per_page) : 10;
      const offset = (page - 1) * per_page;

      const { count, rows } = await db.projectplanSetsObj.findAndCountAll({
        where: whereClause,
        per_page,
        offset,
        order: [["id", "DESC"]],
        include: [
          {
            model: db.userObj,
            as: "reviewedByUser",
            attributes: ["id", "name", "email"],
          },
        ],
      });

      return {
        meta: {
          current_page: page,
          from: offset + 1,
          to: offset + rows.length,
          last_page: Math.ceil(count / per_page),
          per_page: per_page,
          total: count,
        },
        records: rows,
      };
    } catch (e) {
      console.error("Error in getProjectPlanSet:", e);
      throw e;
    }
  },
  async updateProjectPlanSetById(id, updateData) {
    try {
      const planSet = await db.projectplanSetsObj.findOne({ where: { id } });

      if (!planSet) {
        return null;
      }

      await planSet.update(updateData);

      return planSet;
    } catch (e) {
      console.error("Error in updateProjectPlanSetById:", e);
      throw e;
    }
  },
  async deleteProjectPlanSet(id) {
    try {
      const deleted = await db.projectplanSetsObj.destroy({
        where: { id },
      });

      return deleted;
    } catch (e) {
      console.error("Error in deleteProjectPlanSet:", e);
      throw e;
    }
  },
  // Get Project Plan Set By ID
  async getProjectPlanSetById(id) {
    try {
      const planSet = await db.projectplanSetsObj.findOne({
        where: { id },
        include: [
          {
            model: db.userObj,
            as: "reviewedByUser",
            attributes: ["id", "name", "email"],
          },
        ],
      });
      return planSet;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  async getAllProjectDataStatusNew(page = 1, per_page, search = "") {
    try {
      const limit = parseInt(per_page) || 10;
      const offset = (parseInt(page) - 1) * limit || 0;

      const whereClause = {
        takeoff_status: "new",
      };

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
          "project_tags",
          "projectFiles",
          "architecture",
          "takeoffactualtime",
          "dueDate",
          "projectAttachmentUrls",
          "attachmentsLink",
          "projectRifFields",
          "status",
          "takeofCompleteDate",
          "connectplan",
          "surveyorNotes",
          "completedFiles",
          "takeOfEstimateTime",
          "takeoff_status",
          "project_status",
          "priority",
           "takeoffStartDate",
          "takeoffDueDate"
        ],
        include: [
          { model: db.companyObj, as: "engineer" },
          { model: db.companyObj, as: "architect" },
          { model: db.companyObj, as: "developer" },
          { model: db.companyObj, as: "general_contractor" },
          { model: db.userObj, as: "planReviewer" },
          { model: db.projectplanSetsObj, as: "planSets" },
          {
            model: db.stateObj,
            as: "states",
          },
          {
            model: db.projectPhasesObj,
            as: "projectPhase",
          },
          {
            model: db.projectTagsObj,
            as: "projectTag",
          },
        ],
        order: [
          [
            db.Sequelize.literal(
              `CASE WHEN priority = 'true' THEN 0 ELSE 1 END`
            ),
            "ASC",
          ],
          ["id", "DESC"],
        ],
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
  async updateProjectType(projectId, projectType, name = null, units = null) {
    try {
      const project = await db.projectObj.findOne({ where: { id: projectId } });

      if (!project) {
        throw new Error("Project not found");
      }

      project.projectType = projectType;
      if (name !== null) project.name = name;
      if (units !== null) project.units = units;
      await project.save();

      return project;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  async updateProjecttakeOffStatusDataCollect(projectId, takeoff_status) {
    try {
      const project = await db.projectObj.findOne({ where: { id: projectId } });

      if (!project) {
        throw new Error("Project not found");
      }

      project.takeoff_status = takeoff_status;
      await project.save();

      return project;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  async updateProjecttakeOffStatusAssignToBudget(projectId, takeoff_status) {
    try {
      const project = await db.projectObj.findOne({ where: { id: projectId } });

      if (!project) {
        throw new Error("Project not found");
      }

      project.takeoff_status = takeoff_status;
      await project.save();

      return project;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  async getAllProjectDatatakeoffStatusDataCollected(
    page = 1,
    per_page,
    search = ""
  ) {
    try {
      const limit = parseInt(per_page) || 10;
      const offset = (parseInt(page) - 1) * limit || 0;
      const whereClause = {
        takeoff_status: "PROJECT DATA COLLECTED",
      };

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
          "project_tags",
          "projectFiles",
          "architecture",
          "takeoffactualtime",
          "dueDate",
          "projectAttachmentUrls",
          "attachmentsLink",
          "projectRifFields",
          "status",
          "takeofCompleteDate",
          "connectplan",
          "surveyorNotes",
          "completedFiles",
          "takeOfEstimateTime",
          "takeoff_status",
          "project_status",
          "priority",
           "takeoffStartDate",
          "takeoffDueDate"
        ],
        include: [
          { model: db.companyObj, as: "engineer" },
          { model: db.companyObj, as: "architect" },
          { model: db.companyObj, as: "developer" },
          { model: db.companyObj, as: "general_contractor" },
          { model: db.userObj, as: "planReviewer" },
          { model: db.projectplanSetsObj, as: "planSets" },
          { model: db.leadTeamsObj, as: "takeoff_team" },
          {
            model: db.stateObj,
            as: "states",
          },
          {
            model: db.projectPhasesObj,
            as: "projectPhase",
          },
          {
            model: db.projectTagsObj,
            as: "projectTag",
          },
        ],
        order: [
          [
            db.Sequelize.literal(
              `CASE WHEN priority = 'true' THEN 0 ELSE 1 END`
            ),
            "ASC",
          ],
          ["id", "DESC"],
        ],
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
  // async getAllProjectDatatakeoffAssignToTeam(page = 1, per_page, search = "") {
  //     try {
  //         const limit = parseInt(per_page) || 10;
  //         const offset = (parseInt(page) - 1) * limit || 0;
  //         const whereClause = {
  //             takeoff_status: "TAKEOFF ASSIGNED",
  //         };

  //         if (search) {
  //             whereClause.name = { [db.Sequelize.Op.like]: `%${search}%` };
  //         }

  //         const { rows, count } = await db.projectObj.findAndCountAll({
  //             where: whereClause,
  //             limit,
  //             offset,
  //             attributes: [
  //                 "id",
  //                 "user_id",
  //                 "engineer_id",
  //                 "name",
  //                 "city",
  //                 "state",
  //                 "plan_date",
  //                 "bldg_gsqft",
  //                 "address",
  //                 "zip",
  //                 "units",
  //                 "projectType",
  //                 "project_phase",
  //                 "date_received",
  //                 "rev_status",
  //                 "plan_reviewed_date",
  //                 "plan_reviewed_by",
  //                 "plan_revision_notes",
  //                 "data_collocated_date",
  //                 "bldgs",
  //                 "wind_zone",
  //                 "seismic_zone",
  //                 "developer_id",
  //                 "general_contractor_id",
  //                 "assign_to_budget",
  //                 "take_off_team_id",
  //                 "take_off_type",
  //                 "take_off_scope",
  //                 "assign_date",
  //                 "plan_link",
  //                 "submissionType",
  //                 "planFiles",
  //                 "projectTags",
  //                 "projectFiles",
  //                 "architecture",
  //                 "takeoffactualtime",
  //                 "dueDate",
  //                 "projectAttachmentUrls",
  //                 "attachmentsLink",
  //                 "projectRifFields",
  //                 "status",
  //                 "takeofCompleteDate",
  //                 "connectplan",
  //                 "surveyorNotes",
  //                 "completedFiles",
  //                 "takeOfEstimateTime",
  //                 "takeoff_status",
  //                 "project_status",
  //                 "priority"
  //             ],
  //             include: [
  //                 { model: db.companyObj, as: "engineer" },
  //                 { model: db.companyObj, as: "architect" },
  //                 { model: db.companyObj, as: "developer" },
  //                 { model: db.companyObj, as: "general_contractor" },
  //                 { model: db.userObj, as: "planReviewer" },
  //                 { model: db.projectplanSetsObj, as: "planSets" },
  //                 { model: db.leadTeamsObj, as: "takeoff_team" },
  //             ],
  //             order: [
  //                 [db.Sequelize.literal(`CASE WHEN priority = 'true' THEN 0 ELSE 1 END`), "ASC"],
  //                 ["id", "DESC"]
  //             ],
  //         });

  //         return {
  //             data: rows,
  //             meta: {
  //                 current_page: parseInt(page),
  //                 from: offset + 1,
  //                 to: offset + rows.length,
  //                 last_page: Math.ceil(count / limit),
  //                 per_page: limit,
  //                 total: count,
  //             },
  //         };
  //     } catch (e) {
  //         logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //         throw e;
  //     }
  // },
  // async updateProjecttakeOffStatus(ids, takeoff_status) {

  //     const [updatedRows] = await db.projectObj.update(
  //         { takeoff_status },
  //         { where: { id: ids } }
  //     );
  //     return updatedRows;
  // }

  async getAllProjectDatatakeoffAssignToTeam(
    page = 1,
    per_page,
    search = "",
    userId
  ) {
    try {
      const limit = parseInt(per_page) || 10;
      const offset = (parseInt(page) - 1) * limit || 0;

      const whereClause = {
        takeoff_status: "TAKEOFF ASSIGNED",
      };

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
          "project_tags",
          "projectFiles",
          "architecture",
          "takeoffactualtime",
          "dueDate",
          "projectAttachmentUrls",
          "attachmentsLink",
          "projectRifFields",
          "status",
          "takeofCompleteDate",
          "connectplan",
          "surveyorNotes",
          "completedFiles",
          "takeOfEstimateTime",
          "takeoff_status",
          "project_status",
          "priority",
           "takeoffStartDate",
          "takeoffDueDate"
        ],
        include: [
          { model: db.companyObj, as: "engineer" },
          { model: db.companyObj, as: "architect" },
          { model: db.companyObj, as: "developer" },
          { model: db.companyObj, as: "general_contractor" },
          { model: db.userObj, as: "planReviewer" },
          { model: db.projectplanSetsObj, as: "planSets" },
          { model: db.leadTeamsObj, as: "takeoff_team" },
          {
            model: db.stateObj,
            as: "states",
          },
          {
            model: db.projectPhasesObj,
            as: "projectPhase",
          },
          {
            model: db.projectTagsObj,
            as: "projectTag",
          },
        ],
        order: [
          [
            db.Sequelize.literal(
              `CASE WHEN priority = 'true' THEN 0 ELSE 1 END`
            ),
            "ASC",
          ],
          ["id", "DESC"],
        ],
      });

      if (parseInt(userId) === 1) {
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
      }

      const teamIds = rows
        .map((row) => row.take_off_team_id)
        .filter((id) => id !== null && id !== undefined);

      if (teamIds.length === 0) {
        return {
          data: [],
          meta: {
            current_page: parseInt(page),
            from: 0,
            to: 0,
            last_page: 0,
            per_page: limit,
            total: 0,
          },
        };
      }

      const teams = await db.leadTeamsObj.findAll({
        where: {
          id: { [db.Sequelize.Op.in]: teamIds },
        },
      });

      const allowedTeamIds = teams
        .filter((team) => {
          try {
            const contactIds = JSON.parse(team.dataValues.contact_id || "[]");
            return contactIds.includes(String(userId));
          } catch (err) {
            return false;
          }
        })
        .map((team) => team.id);

      const filteredProjects = rows.filter((project) =>
        allowedTeamIds.includes(project.take_off_team_id)
      );

      return {
        data: filteredProjects,
        meta: {
          current_page: parseInt(page),
          from: offset + 1,
          to: offset + filteredProjects.length,
          last_page: Math.ceil(filteredProjects.length / limit),
          per_page: limit,
          total: filteredProjects.length,
        },
      };
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  async updateProjecttakeOffStatus(ids, takeoff_status, priority = false) {
    const updateData = {};

    if (takeoff_status && takeoff_status.trim() !== "") {
      updateData.takeoff_status = takeoff_status;
    }

    updateData.priority = priority;

    const [updatedRows] = await db.projectObj.update(updateData, {
      where: { id: ids },
    });

    return updatedRows;
  },
  async getAllProjectDatatakeoffLead(page, per_page, search, userId) {
    try {
      const limit = parseInt(per_page) || 10;
      const offset = (parseInt(page) - 1) * limit || 0;

      const whereClause = {
        takeoff_status: {
          [Op.in]: ["TAKEOFF COMPLETE", "BUDGET"],
        },
      };

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
          "project_tags",
          "projectFiles",
          "architecture",
          "takeoffactualtime",
          "dueDate",
          "projectAttachmentUrls",
          "attachmentsLink",
          "projectRifFields",
          "status",
          "takeofCompleteDate",
          "connectplan",
          "surveyorNotes",
          "completedFiles",
          "takeOfEstimateTime",
          "takeoff_status",
          "project_status",
          "priority",
           "takeoffStartDate",
          "takeoffDueDate"
        ],
        include: [
          { model: db.companyObj, as: "engineer" },
          { model: db.companyObj, as: "architect" },
          { model: db.companyObj, as: "developer" },
          { model: db.companyObj, as: "general_contractor" },
          { model: db.userObj, as: "planReviewer" },
          { model: db.projectplanSetsObj, as: "planSets" },
          { model: db.leadTeamsObj, as: "takeoff_team" },
          {
            model: db.stateObj,
            as: "states",
          },
          {
            model: db.projectPhasesObj,
            as: "projectPhase",
          },
          {
            model: db.projectTagsObj,
            as: "projectTag",
          },
        ],
        order: [
          [
            db.Sequelize.literal(
              `CASE WHEN priority = 'true' THEN 0 ELSE 1 END`
            ),
            "ASC",
          ],
          ["id", "DESC"],
        ],
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
};
