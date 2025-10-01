require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const projectServices = require("../services/project.services");
const leadServices = require("../services/lead.services");
const { check, validationResult } = require("express-validator"); // Updated import
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});
const db = require("../models");

module.exports = {
  /*addProject*/
  async addProject(req, res) {
    try {
      // const errors = myValidationResult(req);
      // if (!errors.isEmpty()) {
      //     return res
      //         .status(200)
      //         .send(commonHelper.parseErrorRespose(errors.mapped()));
      // }
      let data = req.body;
      let postData = {
        user_id: req.userId,
        site_plan_id: data.site_plan_id,
        engineer_id: data.engineer_id,
        name: data.name,
        city: data.city,
        state: data.state,
        bldg_gsqft: data.bldg_gsqft,
        address: data.address,
        zip: data.zip,
        units: data.units,
        projectType: data.projectType,
        project_phase: data.project_phase,
        bldgs: data.bldgs,
        wind_zone: data.wind_zone,
        seismic_zone: data.seismic_zone,
        developer_id: data.developer_id,
        general_contractor_id: data.general_contractor_id,
        assign_to_budget: data.assign_to_budget,
        take_off_team_id: data.take_off_team_id,
        take_off_type: data.take_off_type,
        take_off_scope: data.take_off_scope,
        assign_date: data.assign_date,
        projectTags: data.projectTags,
        projectFiles: data.projectFiles,
        architecture: data.architecture,
        takeoffactualtime: data.takeoffactualtime,
        dueDate: data.dueDate,
        projectAttachmentUrls: data.projectAttachmentUrls,
        attachmentsLink: data.attachmentsLink,
        projectRifFields: data.projectRifFields,
      };
      let project = await projectServices.addProject(postData);

      if (data.planSets && typeof data.planSets === "string") {
        data.planSets = JSON.parse(data.planSets);
      }

      if (data.planSets && Array.isArray(data.planSets)) {
        for (let plan of data.planSets) {
          let planData = {
            project_id: project.id,
            submissionType: plan.submissionType,
            date_received: plan.date_received,
            plan_link: plan.plan_link,
            planFiles: plan.planFiles,
            plan_date: plan.plan_date,
            rev_status: plan.rev_status,
            plan_reviewed_date: plan.plan_reviewed_date,
            plan_reviewed_by: plan.plan_reviewed_by,
            data_collocated_date: plan.data_collocated_date,
            plan_revision_notes: plan.plan_revision_notes,
          };

          await projectServices.projectplanSets(planData);
        }
      }
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose("", "Project added successfully")
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error || error.message || "Project failed",
        data: error.response?.data || {},
      });
    }
  },
  // /*getAllProject*/
  async getAllProject(req, res) {
    try {
      let { page, length, search } = req.query;
      if (page <= 0 || length <= 0) {
        throw new Error("Page and length must be greater than 0");
      }
      let getAllProject = await projectServices.getAllProject(
        page,
        length,
        search
      );
      if (!getAllProject) throw new Error("Projects not found");
      return res.status(200).send({
        status: true,
        message: " Get all Projects",
        data: getAllProject.data,
        meta: getAllProject.meta,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Getting projects failed",
        data: error.response?.data || {},
      });
    }
  },
  // /*getProjectById*/
  async getProjectById(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let projectId = req.query.projectId;
      let getProjectById = await projectServices.getProjectById(projectId);
      if (!getProjectById) throw new Error("Project not found");
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            getProjectById,
            "Project displayed successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Getting project failed",
        data: error.response?.data || {},
      });
    }
  },
  // /*updateProject*/
  async updateProject(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let projectId = req.query.projectId;
      let getProjectById = await projectServices.getProjectById(projectId);

      if (!getProjectById) throw new Error("Project not found");
      let data = req.body;
      let postData = {
        site_plan_id:
          data.site_plan_id === null || data.site_plan_id === "null"
            ? null
            : data.site_plan_id,
        user_id: req.userId,
        engineer_id: data.engineer_id,
        name: data.name,
        city: data.city,
        state: data.state,
        bldg_gsqft: data.bldg_gsqft,
        address: data.address,
        zip: data.zip,
        units: data.units,
        projectType: data.projectType,
        project_phase: data.project_phase,
        bldgs: data.bldgs,
        wind_zone: data.wind_zone,
        seismic_zone: data.seismic_zone,
        developer_id: data.developer_id,
        general_contractor_id: data.general_contractor_id,
        assign_to_budget: data.assign_to_budget,
        take_off_team_id: data.take_off_team_id,
        take_off_type: data.take_off_type,
        take_off_scope: data.take_off_scope,
        assign_date: data.assign_date,
        projectTags: data.projectTags,
        projectFiles: data.projectFiles,
        architecture: data.architecture,
        takeoffactualtime: data.takeoffactualtime,
        dueDate: data.dueDate,
        projectAttachmentUrls: data.projectAttachmentUrls,
        attachmentsLink: data.attachmentsLink,
        projectRifFields: data.projectRifFields,
      };
      commonHelper.removeFalsyKeys(postData);

      let updateProject = await projectServices.updateProject(
        postData,
        projectId
      );

      await db.projectplanSetsObj.destroy({
        where: { project_id: projectId },
      });
      if (data.planSets && typeof data.planSets === "string") {
        data.planSets = JSON.parse(data.planSets);
      }

      if (data.planSets && Array.isArray(data.planSets)) {
        for (let plan of data.planSets) {
          let planData = {
            project_id: projectId,
            submissionType: plan.submissionType,
            date_received: plan.date_received,
            plan_link: plan.plan_link,
            planFiles: plan.planFiles,
            plan_date: plan.plan_date,
            rev_status: plan.rev_status,
            plan_reviewed_date: plan.plan_reviewed_date,
            plan_reviewed_by: plan.plan_reviewed_by,
            data_collocated_date: plan.data_collocated_date,
            plan_revision_notes: plan.plan_revision_notes,
          };

          await projectServices.projectplanSets(planData);
        }
      }
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            updateProject,
            "Project updated successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Project updation failed",
        data: error.response?.data || {},
      });
    }
  },
  // /*deleteProject*/
  async deleteProject(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let projectId = req.query.projectId;
      let getProjectById = await projectServices.getProjectById(projectId);
      if (!getProjectById) throw new Error("Project not found");
      let deleteProject = await projectServices.deleteProject(projectId);
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            deleteProject,
            "Project deleted successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Project deletion failed",
        data: error.response?.data || {},
      });
    }
  },
  // /*setDefaultLead*/
  async setDefaultLead(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const leadId = req.query.leadId;
      const { isDefaultLead } = req.body;

      if (!leadId) {
        return res.status(400).json({
          status: false,
          message: "leadId is required",
        });
      }

      if (isDefaultLead === undefined) {
        return res.status(400).json({
          status: false,
          message: "isDefaultLead is required in body",
        });
      }

      const updatedLead = await leadServices.setDefaultLead(
        leadId,
        isDefaultLead
      );

      if (!updatedLead) {
        throw new Error("Lead not found or update failed");
      }

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            updatedLead,
            `Lead updated successfully with isDefaultLead=${isDefaultLead}`
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Failed to set default lead",
        data: error.response?.data || {},
      });
    }
  },
  async updateProjectPlanSet(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let projectId = req.query.projectId;
      let getProjectById = await projectServices.getProjectById(projectId);

      if (!getProjectById) throw new Error("Project not found");
      let data = req.body;
      let postData = {
        project_id: projectId,
        submissionType: data.submissionType,
        date_received: data.date_received,
        plan_link: data.plan_link,
        planFiles: data.planFiles,
        plan_date: data.plan_date,
        rev_status: data.rev_status,
        plan_reviewed_date: data.plan_reviewed_date,
        plan_reviewed_by: data.plan_reviewed_by,
        data_collocated_date: data.data_collocated_date,
        plan_revision_notes: data.plan_revision_notes,
      };
      commonHelper.removeFalsyKeys(postData);
      await db.projectplanSetsObj.destroy({
        where: { project_id: projectId },
      });

      await projectServices.projectplanSets(postData);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            "",
            "Project plan set updated successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Project plan set updation failed",
        data: error.response?.data || {},
      });
    }
  },

  /*addProjectNotes*/
  async addProjectNotes(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const { project_id, notes } = req.body;

      if (!project_id || !notes) {
        return res.status(400).json({
          status: false,
          message: "project_id and notes are required",
        });
      }

      const postData = {
        user_id: req.userId, // comes from token
        project_id,
        notes,
      };

      const projectNotes = await projectServices.addProjectNotes(postData);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            projectNotes,
            "Project notes added successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Project notes failed",
        data: error.response?.data || {},
      });
    }
  },

  async listProjectNotes(req, res) {
    try {
      const { limit = 50, projectId } = req.query;

      if (!projectId) {
        return res.status(400).json({
          status: false,
          message: "project_id is required",
        });
      }

      const notes = await projectServices.listProjectNotes(
        projectId,
        parseInt(limit)
      );

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            notes,
            "Project notes fetched successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Failed to fetch project notes",
        data: {},
      });
    }
  },

  async updateProjectNotes(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const { projectNoteId, notes } = req.body;

      if (!projectNoteId || !notes) {
        return res.status(400).json({
          status: false,
          message: "Project note id and notes are required",
        });
      }

      const updatedNote = await projectServices.updateProjectNotes(
        projectNoteId,
        notes
      );

      if (!updatedNote) {
        throw new Error("Project note not found or update failed");
      }

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            updatedNote,
            "Project note updated successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Failed to update project note",
        data: {},
      });
    }
  },

  async deleteProjectNotes(req, res) {
    try {
      const { projectNoteId } = req.query;

      if (!projectNoteId) {
        return res.status(400).json({
          status: false,
          message: "project note id is required",
        });
      }

      const deleted = await projectServices.deleteProjectNotes(projectNoteId);

      if (!deleted) {
        throw new Error("Project note not found or already deleted");
      }

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            {},
            "Project note deleted successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Failed to delete project note",
        data: {},
      });
    }
  },
  // validate(method) {
  //     switch (method) {
  //         case "getProjectById": {
  //             return [
  //                 check("projectId").not().isEmpty().withMessage("ProjectId is Required")
  //             ];
  //         }
  //     }
  // }
};
