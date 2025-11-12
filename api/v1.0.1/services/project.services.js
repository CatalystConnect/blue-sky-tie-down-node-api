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
  // async getAllProject(page = 1, per_page = 10, search = "",take_all, id) {
  //   try {
  //     const limit = parseInt(per_page) || 10;
  //     const offset = (parseInt(page) - 1) * limit || 0;

  //     const whereClause = {};

  //     if (id) {
  //       whereClause.id = id;
  //     }
  //     if (search) {
  //       whereClause.name = { [db.Sequelize.Op.like]: `%${search}%` };
  //     }

  //     const { rows, count } = await db.projectObj.findAndCountAll({
  //       where: whereClause,
  //       limit,
  //       offset,
  //       attributes: [
  //         "id",
  //         "user_id",
  //         "engineer_id",
  //         "name",
  //         "city",
  //         "state",
  //         "plan_date",
  //         "bldg_gsqft",
  //         "address",
  //         "zip",
  //         "units",
  //         "projectType",
  //         "project_phase",
  //         "project_file",
  //         "date_received",
  //         "rev_status",
  //         "plan_reviewed_date",
  //         "plan_reviewed_by",
  //         "plan_revision_notes",
  //         "data_collocated_date",
  //         "bldgs",
  //         "wind_zone",
  //         "seismic_zone",
  //         "developer_id",
  //         "general_contractor_id",
  //         "assign_to_budget",
  //         "take_off_team_id",
  //         "take_off_type",
  //         "take_off_scope",
  //         "assign_date",
  //         "plan_link",
  //         "submissionType",
  //         "planFiles",
  //         "project_tags",
  //         "projectFiles",
  //         "architecture",
  //         "takeoffactualtime",
  //         "dueDate",
  //         "projectAttachmentUrls",
  //         "attachmentsLink",
  //         "projectRifFields",
  //         "takeofCompleteDate",
  //         "connectplan",
  //         "surveyorNotes",
  //         "completedFiles",
  //         "takeOfEstimateTime",
  //         "takeoff_status",
  //         "project_status",
  //         "priority",
  //         "takeoffStartDate",
  //         "takeoffDueDate",
  //         "work_hours",
  //       ],
  //       include: [
  //         { model: db.companyObj, as: "engineer" },
  //         { model: db.companyObj, as: "architect" },
  //         { model: db.companyObj, as: "developer" },
  //         { model: db.companyObj, as: "general_contractor" },
  //         { model: db.userObj, as: "planReviewer" },
  //         {
  //           model: db.projectplanSetsObj,
  //           as: "planSets",
  //           include: [{ model: db.userObj, as: "planReviewerUers" }],
  //         },
  //         { model: db.leadTeamsObj, as: "takeoff_team" },
  //         {
  //           model: db.taxesObj,
  //           as: "zipCodeDetails",
  //         },
  //         {
  //           model: db.taxesObj,
  //           as: "stateDetails",
  //         },
  //         {
  //           model: db.stateObj,
  //           as: "states",
  //         },
  //         {
  //           model: db.projectPhasesObj,
  //           as: "projectPhase",
  //         },
  //         {
  //           model: db.projectTagsObj,
  //           as: "projectTag",
  //         },
  //         {
  //           model: db.projectTagMappingsObj,
  //           as: "projectTagsMapping",
  //           include: [
  //             {
  //               model: db.projectTagsObj,
  //               as: "tags",
  //             },
  //           ],
  //         },
  //         {
  //           model: db.projectTypeMappingsObj,
  //           as: "projectTypeMapping",
  //           include: [
  //             {
  //               model: db.projectTypesObj,
  //               as: "projectType",
  //             },
  //           ],
  //         },
  //         {
  //           model: db.gDriveAssociationObj,
  //           as: "googleDrive",
  //         },
  //       ],
  //       order: [["id", "DESC"]],
  //     });

  //     return {
  //       data: rows,
  //       meta: {
  //         current_page: parseInt(page),
  //         from: offset + 1,
  //         to: offset + rows.length,
  //         last_page: Math.ceil(count / limit),
  //         per_page: limit,
  //         total: count,
  //       },
  //     };
  //   } catch (e) {
  //     logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //     throw e;
  //   }
  // },
  async getAllProject(
    page = 1,
    per_page = 10,
    search = "",
    take_all = false,
    id
  ) {
    try {
      const limit = parseInt(per_page) || 10;
      const offset = (parseInt(page) - 1) * limit || 0;

      const whereClause = {};

      if (search) {
        whereClause.name = { [db.Sequelize.Op.like]: `%${search}%` };
      }

      // ✅ If `take_all` is true, ignore pagination
      const queryOptions = {
        where: whereClause,
        distinct: true,
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
          "project_file",
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
          "takeoffDueDate",
          "work_hours",
        ],
        include: [
          { model: db.companyObj, as: "engineer" },
          { model: db.companyObj, as: "architect" },
          { model: db.companyObj, as: "developer" },
          { model: db.companyObj, as: "general_contractor" },
          { model: db.userObj, as: "planReviewer" },
          {
            model: db.projectplanSetsObj,
            as: "planSets",
            include: [{ model: db.userObj, as: "planReviewerUers" }],
          },
          { model: db.leadTeamsObj, as: "takeoff_team" },
          { model: db.taxesObj, as: "zipCodeDetails" },
          { model: db.taxesObj, as: "stateDetails" },
          { model: db.stateObj, as: "states" },
          { model: db.projectPhasesObj, as: "projectPhase" },
          { model: db.projectTagsObj, as: "projectTag" },
          {
            model: db.projectTagMappingsObj,
            as: "projectTagsMapping",
            include: [{ model: db.projectTagsObj, as: "tags" }],
          },
          {
            model: db.projectTypeMappingsObj,
            as: "projectTypeMapping",
            include: [{ model: db.projectTypesObj, as: "projectType" }],
          },
          { model: db.gDriveAssociationObj, as: "googleDrive" },
        ],
        order: [
          // ✅ This puts the record with matching id at the top
          id
            ? [
                db.Sequelize.literal(
                  `CASE WHEN "projects"."id" = ${id} THEN 0 ELSE 1 END`
                ),
                "ASC",
              ]
            : ["id", "DESC"],
          ["id", "DESC"],
        ],
      };

      // Apply pagination only when take_all = false
      if (!take_all) {
        queryOptions.limit = limit;
        queryOptions.offset = offset;
      }

      const { rows, count } = await db.projectObj.findAndCountAll(queryOptions);

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
          "project_file",
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
          "takeoffDueDate",
          "work_hours",
        ],
        include: [
          { model: db.companyObj, as: "engineer" },
          { model: db.companyObj, as: "architect" },
          { model: db.companyObj, as: "developer" },
          { model: db.companyObj, as: "general_contractor" },
          { model: db.userObj, as: "planReviewer" },
          { model: db.leadTeamsObj, as: "takeoff_team" },
          {
            model: db.projectplanSetsObj,
            as: "planSets",
            include: [{ model: db.userObj, as: "planReviewerUers" }],
          },
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
            model: db.projectTagMappingsObj,
            as: "projectTagsMapping",
            include: [
              {
                model: db.projectTagsObj,
                as: "tags",
              },
            ],
          },
          {
            model: db.projectTypeMappingsObj,
            as: "projectTypeMapping",
            include: [
              {
                model: db.projectTypesObj,
                as: "projectType",
              },
            ],
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
          {
            model: db.gDriveAssociationObj,
            as: "googleDrive",
          },
        ],
      });

      // let project = getProjectById.toJSON();

      // // --- Google Drive grouping ---
      // const googleDriveData = project.googleDrive || [];

      // const googleDrive = {
      //   projectFiles: [],
      //   completedFiles: [],
      //   planSet: [],
      // };

      // googleDriveData.forEach((item) => {
      //   const file = item.dataValues || item;

      //   if (file.module === "projectFiles") googleDrive.projectFiles.push(file);
      //   else if (file.module === "completedFiles")
      //     googleDrive.completedFiles.push(file);
      //   else if (file.module === "planSetFiles") googleDrive.planSet.push(file);
      // });

      // project.googleDrive = googleDrive;

      // return project;
      const project = getProjectById.toJSON();

      // --- Google Drive grouping ---
      const googleDriveData = project.googleDrive || [];

      const googleDrive = {
        projectFiles: [],
        completedFiles: [],
        planSet: [],
        budgetFiles: [],
      };

      // Step 1: Separate modules
      googleDriveData.forEach((item) => {
        const file = item.dataValues || item;

        if (file.module === "projectFiles") {
          googleDrive.projectFiles.push(file);
        } else if (file.module === "completedFiles") {
          googleDrive.completedFiles.push(file);
        } else if (file.module === "planSetFiles") {
          googleDrive.planSet.push(file);
        } else if (file.module === "budgetFiles") {
          googleDrive.budgetFiles.push(file);
        }
      });

      // Step 2: Map planSet.id to folder number
      const planSetFolderMap = {};
      project.planSets?.forEach((planSet, index) => {
        planSetFolderMap[planSet.id] = index + 1;
      });

      // Step 3: Transform planSet into structured object
      const planSet = {};

      googleDrive.planSet.forEach((item) => {
        const moduleId = item.module_id;
        const folderNumber = planSetFolderMap[moduleId] || moduleId;

        if (!planSet[folderNumber]) {
          planSet[folderNumber] = { folder: null, files: [] };
        }

        if (!item.file_name) {
          planSet[folderNumber].folder = {
            drive_id: item.drive_id,
            createdAt: item.createdAt,
          };
        } else {
          planSet[folderNumber].files.push({
            drive_id: item.drive_id,
            file_name: item.file_name,
            createdAt: item.createdAt,
          });
        }
      });

      // Step 4: Assign structured result for planSet only
      googleDrive.planSet = planSet;

      // Step 5: Attach back to project
      project.googleDrive = googleDrive;

      return project;
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
          { "$reviewedByUser.name$": { [Op.like]: `%${filters.search}%` } },
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
            required: false,
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
  async getAllProjectDataStatusNew(page = 1, per_page = 10, search = "") {
    try {
      const limit = parseInt(per_page) || 10;
      const offset = (parseInt(page) - 1) * limit || 0;

      const whereClause = { takeoff_status: "new" };

      if (search) {
        whereClause.name = { [db.Sequelize.Op.like]: `%${search}%` };
      }

      const { rows, count } = await db.projectObj.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        distinct: true,
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
          "project_file",
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
          "takeoffDueDate",
          "work_hours",
        ],
        include: [
          { model: db.companyObj, as: "engineer" },
          { model: db.companyObj, as: "architect" },
          { model: db.companyObj, as: "developer" },
          { model: db.companyObj, as: "general_contractor" },
          { model: db.userObj, as: "planReviewer" },
          { model: db.projectplanSetsObj, as: "planSets" },
          { model: db.stateObj, as: "states" },
          { model: db.projectPhasesObj, as: "projectPhase" },
          { model: db.projectTagsObj, as: "projectTag" },
          {
            model: db.projectTagMappingsObj,
            as: "projectTagsMapping",
            include: [{ model: db.projectTagsObj, as: "tags" }],
          },
          {
            model: db.projectTypeMappingsObj,
            as: "projectTypeMapping",
            include: [
              {
                model: db.projectTypesObj,
                as: "projectType",
              },
            ],
          },
          { model: db.gDriveAssociationObj, as: "googleDrive" },
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

      // Process and transform each project
      const projects = rows.map((projectInstance) => {
        const project = projectInstance.toJSON();

        const googleDriveData = project.googleDrive || [];
        const googleDrive = {
          projectFiles: [],
          completedFiles: [],
          planSet: [],
        };

        // Step 1: Separate Google Drive modules
        googleDriveData.forEach((item) => {
          const file = item.dataValues || item;
          if (file.module === "projectFiles")
            googleDrive.projectFiles.push(file);
          else if (file.module === "completedFiles")
            googleDrive.completedFiles.push(file);
          else if (file.module === "planSetFiles")
            googleDrive.planSet.push(file);
        });

        // Step 2: Transform planSet into structured object
        const planSet = {};
        googleDrive.planSet.forEach((item) => {
          const moduleId = item.module_id;
          if (!planSet[moduleId])
            planSet[moduleId] = { folder: null, files: [] };

          if (!item.file_name) {
            planSet[moduleId].folder = {
              drive_id: item.drive_id,
              createdAt: item.createdAt,
            };
          } else {
            planSet[moduleId].files.push({
              drive_id: item.drive_id,
              file_name: item.file_name,
              createdAt: item.createdAt,
            });
          }
        });

        googleDrive.planSet = planSet;
        project.googleDrive = googleDrive;

        return project;
      });

      return {
        data: projects,
        meta: {
          current_page: parseInt(page),
          from: offset + 1,
          to: offset + projects.length,
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
  // async getAllProjectDataStatusNew(page = 1, per_page, search = "") {
  //   try {
  //     const limit = parseInt(per_page) || 10;
  //     const offset = (parseInt(page) - 1) * limit || 0;

  //     const whereClause = {
  //       takeoff_status: "new",
  //     };

  //     if (search) {
  //       whereClause.name = { [db.Sequelize.Op.like]: `%${search}%` };
  //     }

  //     const { rows, count } = await db.projectObj.findAndCountAll({
  //       where: whereClause,
  //       limit,
  //       offset,
  //       attributes: [
  //         "id",
  //         "user_id",
  //         "engineer_id",
  //         "name",
  //         "city",
  //         "state",
  //         "plan_date",
  //         "bldg_gsqft",
  //         "address",
  //         "zip",
  //         "units",
  //         "projectType",
  //         "project_phase",
  //         "date_received",
  //         "rev_status",
  //         "project_file",
  //         "plan_reviewed_date",
  //         "plan_reviewed_by",
  //         "plan_revision_notes",
  //         "data_collocated_date",
  //         "bldgs",
  //         "wind_zone",
  //         "seismic_zone",
  //         "developer_id",
  //         "general_contractor_id",
  //         "assign_to_budget",
  //         "take_off_team_id",
  //         "take_off_type",
  //         "take_off_scope",
  //         "assign_date",
  //         "plan_link",
  //         "submissionType",
  //         "planFiles",
  //         "project_tags",
  //         "projectFiles",
  //         "architecture",
  //         "takeoffactualtime",
  //         "dueDate",
  //         "projectAttachmentUrls",
  //         "attachmentsLink",
  //         "projectRifFields",
  //         "status",
  //         "takeofCompleteDate",
  //         "connectplan",
  //         "surveyorNotes",
  //         "completedFiles",
  //         "takeOfEstimateTime",
  //         "takeoff_status",
  //         "project_status",
  //         "priority",
  //         "takeoffStartDate",
  //         "takeoffDueDate",
  //         "work_hours",
  //       ],
  //       include: [
  //         { model: db.companyObj, as: "engineer" },
  //         { model: db.companyObj, as: "architect" },
  //         { model: db.companyObj, as: "developer" },
  //         { model: db.companyObj, as: "general_contractor" },
  //         { model: db.userObj, as: "planReviewer" },
  //         { model: db.projectplanSetsObj, as: "planSets" },
  //         {
  //           model: db.stateObj,
  //           as: "states",
  //         },
  //         {
  //           model: db.projectPhasesObj,
  //           as: "projectPhase",
  //         },
  //         {
  //           model: db.projectTagsObj,
  //           as: "projectTag",
  //         },
  //         {
  //           model: db.projectTagMappingsObj,
  //           as: "projectTagsMapping",
  //           include: [
  //             {
  //               model: db.projectTagsObj,
  //               as: "tags",
  //             },
  //           ],
  //         },
  //         {
  //           model: db.gDriveAssociationObj,
  //           as: "googleDrive",
  //         },
  //       ],
  //       order: [
  //         [
  //           db.Sequelize.literal(
  //             `CASE WHEN priority = 'true' THEN 0 ELSE 1 END`
  //           ),
  //           "ASC",
  //         ],
  //         ["id", "DESC"],
  //       ],
  //     });

  //     const projects = rows.map((projectInstance) => {
  //       const project = projectInstance.toJSON();

  //       const googleDriveData = project.googleDrive || [];

  //       const googleDrive = {
  //         projectFiles: [],
  //         completedFiles: [],
  //         planSet: [],
  //       };

  //       googleDriveData.forEach((item) => {
  //         const file = item.dataValues || item;

  //         if (file.module === "projectFiles")
  //           googleDrive.projectFiles.push(file);
  //         else if (file.module === "completedFiles")
  //           googleDrive.completedFiles.push(file);
  //         else if (file.module === "planSetFiles")
  //           googleDrive.planSet.push(file);
  //       });

  //       project.googleDrive = googleDrive;

  //       return project;
  //     });

  //     return {
  //       data: projects,
  //       meta: {
  //         current_page: parseInt(page),
  //         from: offset + 1,
  //         to: offset + rows.length,
  //         last_page: Math.ceil(count / limit),
  //         per_page: limit,
  //         total: count,
  //       },
  //     };
  //   } catch (e) {
  //     logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //     throw e;
  //   }
  // },
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
        takeoff_status: "project_data_collected",
      };

      if (search) {
        whereClause.name = { [db.Sequelize.Op.like]: `%${search}%` };
      }

      const { rows, count } = await db.projectObj.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        distinct: true,
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
          "project_file",
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
          "takeoffDueDate",
          "work_hours",
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
          {
            model: db.projectTagMappingsObj,
            as: "projectTagsMapping",
            include: [
              {
                model: db.projectTagsObj,
                as: "tags",
              },
            ],
          },
          {
            model: db.projectTypeMappingsObj,
            as: "projectTypeMapping",
            include: [
              {
                model: db.projectTypesObj,
                as: "projectType",
              },
            ],
          },
          {
            model: db.gDriveAssociationObj,
            as: "googleDrive",
          },
          {
            model: db.leadsObj,
            as: "project_leads",
            required: false,
            separate: true,
            include: [
              {
                model: db.companyObj,
                as: "lead_company",
                required: false,
              },
            ],
          },
        ],
        order: [
          [
            db.Sequelize.literal(
              `CASE WHEN "projects"."priority" = 'true' THEN 0 ELSE 1 END`
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

  // async getAllProjectDatatakeoffAssignToTeam(
  //   page = 1,
  //   per_page,
  //   search = "",
  //   userId
  // ) {
  //   try {
  //     const limit = parseInt(per_page) || 10;
  //     const offset = (parseInt(page) - 1) * limit || 0;

  //     const whereClause = {
  //       takeoff_status: "TAKEOFF ASSIGNED",
  //     };

  //     if (search) {
  //       whereClause.name = { [db.Sequelize.Op.like]: `%${search}%` };
  //     }

  //     const { rows, count } = await db.projectObj.findAndCountAll({
  //       where: whereClause,
  //       limit,
  //       offset,
  //       attributes: [
  //         "id",
  //         "user_id",
  //         "engineer_id",
  //         "name",
  //         "city",
  //         "state",
  //         "plan_date",
  //         "bldg_gsqft",
  //         "address",
  //         "zip",
  //         "units",
  //         "projectType",
  //         "project_phase",
  //         "date_received",
  //         "rev_status",
  //         "plan_reviewed_date",
  //         "plan_reviewed_by",
  //         "plan_revision_notes",
  //         "data_collocated_date",
  //         "bldgs",
  //         "wind_zone",
  //         "seismic_zone",
  //         "developer_id",
  //         "general_contractor_id",
  //         "assign_to_budget",
  //         "take_off_team_id",
  //         "take_off_type",
  //         "take_off_scope",
  //         "assign_date",
  //         "plan_link",
  //         "submissionType",
  //         "planFiles",
  //         "project_tags",
  //         "projectFiles",
  //         "architecture",
  //         "takeoffactualtime",
  //         "dueDate",
  //         "project_file",
  //         "projectAttachmentUrls",
  //         "attachmentsLink",
  //         "projectRifFields",
  //         "status",
  //         "takeofCompleteDate",
  //         "connectplan",
  //         "surveyorNotes",
  //         "completedFiles",
  //         "takeOfEstimateTime",
  //         "takeoff_status",
  //         "project_status",
  //         "priority",
  //         "takeoffStartDate",
  //         "takeoffDueDate",
  //         "work_hours",
  //       ],
  //       include: [
  //         { model: db.companyObj, as: "engineer" },
  //         { model: db.companyObj, as: "architect" },
  //         { model: db.companyObj, as: "developer" },
  //         { model: db.companyObj, as: "general_contractor" },
  //         { model: db.userObj, as: "planReviewer" },
  //         { model: db.projectplanSetsObj, as: "planSets" },
  //         { model: db.leadTeamsObj, as: "takeoff_team" },
  //         {
  //           model: db.stateObj,
  //           as: "states",
  //         },
  //         {
  //           model: db.projectPhasesObj,
  //           as: "projectPhase",
  //         },
  //         {
  //           model: db.projectTagsObj,
  //           as: "projectTag",
  //         },
  //         {
  //           model: db.projectTagMappingsObj,
  //           as: "projectTagsMapping",
  //           include: [
  //             {
  //               model: db.projectTagsObj,
  //               as: "tags",
  //             },
  //           ],
  //         },
  //         {
  //           model: db.gDriveAssociationObj,
  //           as: "googleDrive",
  //         },
  //       ],
  //       order: [
  //         [
  //           db.Sequelize.literal(
  //             `CASE WHEN priority = 'true' THEN 0 ELSE 1 END`
  //           ),
  //           "ASC",
  //         ],
  //         ["id", "DESC"],
  //       ],
  //     });

  //     if (parseInt(userId) === 1) {
  //       return {
  //         data: rows,
  //         meta: {
  //           current_page: parseInt(page),
  //           from: offset + 1,
  //           to: offset + rows.length,
  //           last_page: Math.ceil(count / limit),
  //           per_page: limit,
  //           total: count,
  //         },
  //       };
  //     }

  //     const teamIds = rows
  //       .map((row) => row.take_off_team_id)
  //       .filter((id) => id !== null && id !== undefined);

  //     if (teamIds.length === 0) {
  //       return {
  //         data: [],
  //         meta: {
  //           current_page: parseInt(page),
  //           from: 0,
  //           to: 0,
  //           last_page: 0,
  //           per_page: limit,
  //           total: 0,
  //         },
  //       };
  //     }

  //     const teams = await db.leadTeamsObj.findAll({
  //       where: {
  //         id: { [db.Sequelize.Op.in]: teamIds },
  //       },
  //     });

  //     const allowedTeamIds = teams
  //       .filter((team) => {
  //         try {
  //           const contactIds = JSON.parse(team.dataValues.contact_id || "[]");
  //           return contactIds.includes(String(userId));
  //         } catch (err) {
  //           return false;
  //         }
  //       })
  //       .map((team) => team.id);

  //     const filteredProjects = rows.filter((project) =>
  //       allowedTeamIds.includes(project.take_off_team_id)
  //     );

  //     return {
  //       data: filteredProjects,
  //       meta: {
  //         current_page: parseInt(page),
  //         from: offset + 1,
  //         to: offset + filteredProjects.length,
  //         last_page: Math.ceil(filteredProjects.length / limit),
  //         per_page: limit,
  //         total: filteredProjects.length,
  //       },
  //     };
  //   } catch (e) {
  //     logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //     throw e;
  //   }
  // },
  // async getAllProjectDatatakeoffAssignToTeam(
  //   page = 1,
  //   per_page,
  //   search = "",
  //   userId
  // ) {
  //   try {
  //     const limit = parseInt(per_page) || 10;
  //     const offset = (parseInt(page) - 1) * limit || 0;

  //     const whereClause = { takeoff_status: "takeoff_assigned" };

  //     if (search) {
  //       whereClause.name = { [db.Sequelize.Op.like]: `%${search}%` };
  //     }

  //     const { rows, count } = await db.projectObj.findAndCountAll({
  //       where: whereClause,
  //       limit,
  //       offset,
  //       distinct: true,
  //       attributes: [
  //         "id",
  //         "user_id",
  //         "engineer_id",
  //         "name",
  //         "city",
  //         "state",
  //         "plan_date",
  //         "bldg_gsqft",
  //         "address",
  //         "zip",
  //         "units",
  //         "projectType",
  //         "project_phase",
  //         "date_received",
  //         "rev_status",
  //         "plan_reviewed_date",
  //         "plan_reviewed_by",
  //         "plan_revision_notes",
  //         "data_collocated_date",
  //         "bldgs",
  //         "wind_zone",
  //         "seismic_zone",
  //         "developer_id",
  //         "general_contractor_id",
  //         "assign_to_budget",
  //         "take_off_team_id",
  //         "take_off_type",
  //         "take_off_scope",
  //         "assign_date",
  //         "plan_link",
  //         "submissionType",
  //         "planFiles",
  //         "project_tags",
  //         "projectFiles",
  //         "architecture",
  //         "takeoffactualtime",
  //         "dueDate",
  //         "project_file",
  //         "projectAttachmentUrls",
  //         "attachmentsLink",
  //         "projectRifFields",
  //         "status",
  //         "takeofCompleteDate",
  //         "connectplan",
  //         "surveyorNotes",
  //         "completedFiles",
  //         "takeOfEstimateTime",
  //         "takeoff_status",
  //         "project_status",
  //         "priority",
  //         "takeoffStartDate",
  //         "takeoffDueDate",
  //         "work_hours",
  //       ],
  //       include: [
  //         { model: db.companyObj, as: "engineer" },
  //         { model: db.companyObj, as: "architect" },
  //         { model: db.companyObj, as: "developer" },
  //         { model: db.companyObj, as: "general_contractor" },
  //         { model: db.userObj, as: "planReviewer" },
  //         { model: db.projectplanSetsObj, as: "planSets" },
  //         { model: db.leadTeamsObj, as: "takeoff_team" },
  //         { model: db.stateObj, as: "states" },
  //         { model: db.projectPhasesObj, as: "projectPhase" },
  //         { model: db.projectTagsObj, as: "projectTag" },
  //         {
  //           model: db.projectTagMappingsObj,
  //           as: "projectTagsMapping",
  //           include: [{ model: db.projectTagsObj, as: "tags" }],
  //         },
  //         {
  //           model: db.projectTypeMappingsObj,
  //           as: "projectTypeMapping",
  //           include: [
  //             {
  //               model: db.projectTypesObj,
  //               as: "projectType",
  //             },
  //           ],
  //         },
  //         { model: db.gDriveAssociationObj, as: "googleDrive" },
  //       ],
  //       order: [
  //         [
  //           db.Sequelize.literal(
  //             `CASE WHEN priority = 'true' THEN 0 ELSE 1 END`
  //           ),
  //           "ASC",
  //         ],
  //         ["id", "DESC"],
  //       ],
  //     });

  //     // Handle Admin (userId = 1)
  //     let projects = rows;

  //     const user = await db.userObj.findOne({
  //       where: { id: userId },
  //       attributes: ['role']
  //     });

  //     if (parseInt(user.role) !== 1) {
  //       const teamIds = rows
  //         .map((row) => row.take_off_team_id)
  //         .filter((id) => id !== null && id !== undefined);

  //       if (teamIds.length === 0) {
  //         return {
  //           data: [],
  //           meta: {
  //             current_page: parseInt(page),
  //             from: 0,
  //             to: 0,
  //             last_page: 0,
  //             per_page: limit,
  //             total: 0,
  //           },
  //         };
  //       }

  //       const teams = await db.leadTeamsObj.findAll({
  //         where: { id: { [db.Sequelize.Op.in]: teamIds } },
  //       });

  //       const allowedTeamIds = teams
  //         .filter((team) => {
  //           try {
  //             const contactIds = JSON.parse(team.dataValues.contact_id || "[]");
  //             return contactIds.includes(String(userId));
  //           } catch {
  //             return false;
  //           }
  //         })
  //         .map((team) => team.id);

  //       projects = rows.filter((project) =>
  //         allowedTeamIds.includes(project.take_off_team_id)
  //       );
  //     }

  //     // ✅ Process Google Drive grouping
  //     const formattedProjects = projects.map((projectInstance) => {
  //       const project = projectInstance.toJSON();
  //       const googleDriveData = project.googleDrive || [];

  //       const googleDrive = {
  //         projectFiles: [],
  //         completedFiles: [],
  //         planSet: [],
  //       };

  //       // Step 1: Separate by module
  //       googleDriveData.forEach((item) => {
  //         const file = item.dataValues || item;
  //         if (file.module === "projectFiles")
  //           googleDrive.projectFiles.push(file);
  //         else if (file.module === "completedFiles")
  //           googleDrive.completedFiles.push(file);
  //         else if (file.module === "planSetFiles")
  //           googleDrive.planSet.push(file);
  //       });

  //       // Step 2: Transform planSet into folder/files structure
  //       const planSet = {};
  //       googleDrive.planSet.forEach((item) => {
  //         const moduleId = item.module_id;
  //         if (!planSet[moduleId])
  //           planSet[moduleId] = { folder: null, files: [] };

  //         if (!item.file_name) {
  //           planSet[moduleId].folder = {
  //             drive_id: item.drive_id,
  //             createdAt: item.createdAt,
  //           };
  //         } else {
  //           planSet[moduleId].files.push({
  //             drive_id: item.drive_id,
  //             file_name: item.file_name,
  //             createdAt: item.createdAt,
  //           });
  //         }
  //       });

  //       googleDrive.planSet = planSet;
  //       project.googleDrive = googleDrive;

  //       return project;
  //     });

  //     return {
  //       data: formattedProjects,
  //       meta: {
  //         current_page: parseInt(page),
  //         from: offset + 1,
  //         to: offset + formattedProjects.length,
  //         last_page: Math.ceil(count / limit),
  //         per_page: limit,
  //         total: count,
  //       },
  //     };
  //   } catch (e) {
  //     logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //     throw e;
  //   }
  // },
  //   async getAllProjectDatatakeoffAssignToTeam(
  //     page = 1,
  //     per_page,
  //     search = "",
  //     userId
  //   ) {
  //     try {
  //       const limit = parseInt(per_page) || 10;
  //       const offset = (parseInt(page) - 1) * limit || 0;

  //       const whereClause = { takeoff_status: "takeoff_assigned" };

  //       if (search) {
  //         whereClause.name = { [db.Sequelize.Op.like]: `%${search}%` };
  //       }

  //       const { rows, count } = await db.projectObj.findAndCountAll({
  //         where: whereClause,
  //         limit,
  //         offset,
  //         distinct: true,
  //         attributes: [
  //           "id", "user_id", "engineer_id", "name", "city", "state", "plan_date",
  //           "bldg_gsqft", "address", "zip", "units", "projectType", "project_phase",
  //           "date_received", "rev_status", "plan_reviewed_date", "plan_reviewed_by",
  //           "plan_revision_notes", "data_collocated_date", "bldgs", "wind_zone",
  //           "seismic_zone", "developer_id", "general_contractor_id", "assign_to_budget",
  //           "take_off_team_id", "take_off_type", "take_off_scope", "assign_date",
  //           "plan_link", "submissionType", "planFiles", "project_tags", "projectFiles",
  //           "architecture", "takeoffactualtime", "dueDate", "project_file",
  //           "projectAttachmentUrls", "attachmentsLink", "projectRifFields", "status",
  //           "takeofCompleteDate", "connectplan", "surveyorNotes", "completedFiles",
  //           "takeOfEstimateTime", "takeoff_status", "project_status", "priority",
  //           "takeoffStartDate", "takeoffDueDate", "work_hours",
  //         ],
  //         include: [
  //           { model: db.companyObj, as: "engineer" },
  //           { model: db.companyObj, as: "architect" },
  //           { model: db.companyObj, as: "developer" },
  //           { model: db.companyObj, as: "general_contractor" },
  //           { model: db.userObj, as: "planReviewer" },
  //           { model: db.projectplanSetsObj, as: "planSets" },
  //           { model: db.leadTeamsObj, as: "takeoff_team" },
  //           { model: db.stateObj, as: "states" },
  //           { model: db.projectPhasesObj, as: "projectPhase" },
  //           { model: db.projectTagsObj, as: "projectTag" },
  //           {
  //             model: db.projectTagMappingsObj,
  //             as: "projectTagsMapping",
  //             include: [{ model: db.projectTagsObj, as: "tags" }],
  //           },
  //           {
  //             model: db.projectTypeMappingsObj,
  //             as: "projectTypeMapping",
  //             include: [{ model: db.projectTypesObj, as: "projectType" }],
  //           },
  //           { model: db.gDriveAssociationObj, as: "googleDrive" },
  //         ],
  //         order: [
  //           [db.Sequelize.literal(`CASE WHEN priority = 'true' THEN 0 ELSE 1 END`), "ASC"],
  //           ["id", "DESC"],
  //         ],
  //       });
  // console.log("user role:", userId);
  //       const user = await db.userObj.findOne({
  //         where: { id: userId },
  //         attributes: ["role"],
  //       });
  //       console.log("user role:", user.role);

  //       let projects = rows;
  //       let filteredCount = count;

  //       if (parseInt(user.role) !== 1) {
  //         const teamIds = rows
  //           .map((row) => row.take_off_team_id)
  //           .filter((id) => id !== null && id !== undefined);

  //         if (teamIds.length === 0) {
  //           return {
  //             data: [],
  //             meta: {
  //               current_page: parseInt(page),
  //               from: 0,
  //               to: 0,
  //               last_page: 0,
  //               per_page: limit,
  //               total: 0,
  //             },
  //           };
  //         }

  //         const teams = await db.leadTeamsObj.findAll({
  //           where: { id: { [db.Sequelize.Op.in]: teamIds } },
  //         });

  //         const allowedTeamIds = teams
  //           .filter((team) => {
  //             try {
  //               const contactIds = JSON.parse(team.dataValues.contact_id || "[]");
  //               return contactIds.includes(String(userId));
  //             } catch {
  //               return false;
  //             }
  //           })
  //           .map((team) => team.id);

  //         projects = rows.filter((project) =>
  //           allowedTeamIds.includes(project.take_off_team_id)
  //         );

  //         filteredCount = projects.length;
  //       }

  //       const formattedProjects = projects.map((projectInstance) => {
  //         const project = projectInstance.toJSON();
  //         const googleDriveData = project.googleDrive || [];

  //         const googleDrive = {
  //           projectFiles: [],
  //           completedFiles: [],
  //           planSet: [],
  //         };

  //         googleDriveData.forEach((item) => {
  //           const file = item.dataValues || item;
  //           if (file.module === "projectFiles") googleDrive.projectFiles.push(file);
  //           else if (file.module === "completedFiles") googleDrive.completedFiles.push(file);
  //           else if (file.module === "planSetFiles") googleDrive.planSet.push(file);
  //         });

  //         const planSet = {};
  //         googleDrive.planSet.forEach((item) => {
  //           const moduleId = item.module_id;
  //           if (!planSet[moduleId]) planSet[moduleId] = { folder: null, files: [] };

  //           if (!item.file_name) {
  //             planSet[moduleId].folder = {
  //               drive_id: item.drive_id,
  //               createdAt: item.createdAt,
  //             };
  //           } else {
  //             planSet[moduleId].files.push({
  //               drive_id: item.drive_id,
  //               file_name: item.file_name,
  //               createdAt: item.createdAt,
  //             });
  //           }
  //         });

  //         googleDrive.planSet = planSet;
  //         project.googleDrive = googleDrive;

  //         return project;
  //       });

  //       return {
  //         data: formattedProjects,
  //         meta: {
  //           current_page: parseInt(page),
  //           from: offset + 1,
  //           to: offset + formattedProjects.length,
  //           last_page: Math.ceil(filteredCount / limit),
  //           per_page: limit,
  //           total: filteredCount,
  //         },
  //       };
  //     } catch (e) {
  //       logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //       throw e;
  //     }
  //   },
  async getAllProjectDatatakeoffAssignToTeam(
    page = 1,
    per_page,
    search = "",
    userId
  ) {
    try {
      const limit = parseInt(per_page) || 10;
      const offset = (parseInt(page) - 1) * limit || 0;

      // Get user role
      const user = await db.userObj.findOne({
        where: { id: userId },
        attributes: ["role"],
      });
      if (!user) throw new Error("User not found");

      const isAdmin = parseInt(user.role) === 1;

      // Base where clause
      const whereClause = { takeoff_status: "takeoff_assigned" };
      if (search) {
        whereClause.name = { [db.Sequelize.Op.like]: `%${search}%` };
      }

      // If non-admin, filter by user's team IDs
      if (!isAdmin) {
        const userTeams = await db.leadTeamsObj.findAll();
        const allowedTeamIds = userTeams
          .filter((team) => {
            try {
              const contactIds = JSON.parse(team.dataValues.contact_id || "[]");
              return contactIds.includes(String(userId));
            } catch {
              return false;
            }
          })
          .map((team) => team.id);

        if (allowedTeamIds.length === 0) {
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

        whereClause.take_off_team_id = { [db.Sequelize.Op.in]: allowedTeamIds };
      }

      // Fetch projects with proper filtering in DB
      const { rows, count } = await db.projectObj.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        distinct: true,
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
          "project_file",
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
          "takeoffDueDate",
          "work_hours",
        ],
        include: [
          { model: db.companyObj, as: "engineer" },
          { model: db.companyObj, as: "architect" },
          { model: db.companyObj, as: "developer" },
          { model: db.companyObj, as: "general_contractor" },
          { model: db.userObj, as: "planReviewer" },
          { model: db.projectplanSetsObj, as: "planSets" },
          { model: db.leadTeamsObj, as: "takeoff_team" },
          { model: db.stateObj, as: "states" },
          { model: db.projectPhasesObj, as: "projectPhase" },
          { model: db.projectTagsObj, as: "projectTag" },
          {
            model: db.projectTagMappingsObj,
            as: "projectTagsMapping",
            include: [{ model: db.projectTagsObj, as: "tags" }],
          },
          {
            model: db.projectTypeMappingsObj,
            as: "projectTypeMapping",
            include: [{ model: db.projectTypesObj, as: "projectType" }],
          },
          { model: db.gDriveAssociationObj, as: "googleDrive" },
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

      // Format Google Drive data
      const formattedProjects = rows.map((projectInstance) => {
        const project = projectInstance.toJSON();
        const googleDriveData = project.googleDrive || [];

        const googleDrive = {
          projectFiles: [],
          completedFiles: [],
          planSet: [],
        };

        googleDriveData.forEach((item) => {
          const file = item.dataValues || item;
          if (file.module === "projectFiles")
            googleDrive.projectFiles.push(file);
          else if (file.module === "completedFiles")
            googleDrive.completedFiles.push(file);
          else if (file.module === "planSetFiles")
            googleDrive.planSet.push(file);
        });

        const planSet = {};
        googleDrive.planSet.forEach((item) => {
          const moduleId = item.module_id;
          if (!planSet[moduleId])
            planSet[moduleId] = { folder: null, files: [] };

          if (!item.file_name) {
            planSet[moduleId].folder = {
              drive_id: item.drive_id,
              createdAt: item.createdAt,
            };
          } else {
            planSet[moduleId].files.push({
              drive_id: item.drive_id,
              file_name: item.file_name,
              createdAt: item.createdAt,
            });
          }
        });

        googleDrive.planSet = planSet;
        project.googleDrive = googleDrive;

        return project;
      });

      return {
        data: formattedProjects,
        meta: {
          current_page: parseInt(page),
          from: offset + 1,
          to: offset + formattedProjects.length,
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

  async addProjectTags(projectId, tagIds) {
    try {
      if (!Array.isArray(tagIds)) {
        tagIds = [tagIds];
      }

      const records = tagIds.map((tagId) => ({
        project_id: projectId,
        tag_id: tagId,
      }));

      await db.projectTagMappingsObj.bulkCreate(records);

      return true;
    } catch (error) {
      console.error("Error adding project tags:", error);
      throw error;
    }
  },
  async removeProjectTags(projectId) {
    try {
      await db.projectTagMappingsObj.destroy({
        where: { project_id: projectId },
      });
      return true;
    } catch (error) {
      throw new Error("Failed to remove project tags: " + error.message);
    }
  },

  async addDriveAssociation({
    parent,
    module,
    module_id,
    drive_id,
    file_name,
  }) {
    return await db.gDriveAssociationObj.create({
      parent,
      module,
      module_id,
      drive_id,
      file_name,
    });
  },

  async updatePlanFiles(planId, planFilesJson) {
    return await db.projectplanSetsObj.update(
      { planFiles: planFilesJson },
      { where: { id: planId } }
    );
  },

  // async updateProject(projectId, updateData) {
  //   return await db.projectObj.update(updateData, {
  //     where: { id: projectId },
  //   });
  // },

  async deleteDriveAssociation(driveId) {
    try {
      return await db.gDriveAssociationObj.destroy({
        where: {
          drive_id: driveId,
        },
      });
    } catch (error) {
      console.error("Failed to delete drive association:", error);
      throw error;
    }
  },
  async saveProjectTypeMappings(projectId, projectTypeIds) {
    if (!projectId || !Array.isArray(projectTypeIds)) {
      throw new Error(
        "Invalid input: projectId and projectTypeIds are required"
      );
    }

    const mappings = projectTypeIds.map((typeId) => ({
      project_id: projectId,
      project_type_id: parseInt(typeId, 10),
    }));

    try {
      await db.projectTypeMappingsObj.bulkCreate(mappings);
      console.log("Project type mappings saved successfully");
    } catch (error) {
      console.error("Error saving project type mappings:", error);
      throw error;
    }
  },
  async addProjectType(projectId, tagIds) {
    try {
      if (!Array.isArray(tagIds)) {
        tagIds = [tagIds];
      }

      const records = tagIds.map((tagId) => ({
        project_id: projectId,
        project_type_id: tagId,
      }));

      await db.projectTypeMappingsObj.bulkCreate(records);

      return true;
    } catch (error) {
      console.error("Error adding project tags:", error);
      throw error;
    }
  },
  async updateProjectTypes(projectId, typeIds) {
    await db.projectTypeMappingsObj.destroy({
      where: { project_id: projectId },
    });

    if (Array.isArray(typeIds) && typeIds.length > 0) {
      const newMappings = typeIds.map((typeId) => ({
        project_id: projectId,
        project_type_id: typeId,
      }));
      await db.projectTypeMappingsObj.bulkCreate(newMappings);
    }
  },

  async updateProjectTags(projectId, typeIds) {
    await db.projectTagMappingsObj.destroy({
      where: { project_id: projectId },
    });

    if (Array.isArray(typeIds) && typeIds.length > 0) {
      const newMappings = typeIds.map((typeId) => ({
        project_id: projectId,
        tag_id: typeId,
      }));
      await db.projectTagMappingsObj.bulkCreate(newMappings);
    }
  },
};
