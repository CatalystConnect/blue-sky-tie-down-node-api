require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const leadServices = require("../services/lead.services");
const addCustomer = require("../services/auth.services");
const activityServices = require("../services/activities.services");
const notesServices = require("../services/notes.services");
var bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator"); // Updated import
const authServices = require("../services/auth.services");
const config = require("../../../config/db.config");
var jwt = require("jsonwebtoken");

const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});
const db = require("../models");
const leadTagsServices = require("../services/leadTags.services");
const salesPipelineStatusesServices = require("../services/salesPipelineStatuses.services");
module.exports = {
  /*getAllLeads*/
  async getAllLeads(req, res) {
    try {
      let { page = 1, per_page, search, date, take_all } = req.query;

      page = parseInt(page);
      per_page = parseInt(per_page) || 10;

      if (page <= 0 || per_page <= 0) {
        throw new Error("Page and length must be greater than 0");
      }

      let { leads, meta } = await leadServices.getAllLeads(
        page,
        per_page,
        search,
        date,
        take_all
      );

      return res.status(200).send({
        status: true,
        message: "Lead Types fetched successfully",
        data: leads,
        meta: meta,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Getting leads failed",
        data: error.response?.data || {},
      });
    }
  },
  /*add lead*/
  async addLead(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      let data = req.body;

      let pipeline_status = null;
      if (data.pipeline_type) {
        try {
          const defaultPipeline =
            await salesPipelineStatusesServices.getDefaultPipelineStatusByType(
              data.pipeline_type
            );

          if (defaultPipeline) {
            pipeline_status = defaultPipeline.id;
          }
        } catch (err) {
          console.warn("Default pipeline not found:", err.message);
        }
      }

      let postData = {
        date_record: data.date_record || null,
        due_date: data.due_date || null,
        nextStepDate: data.nextStepDate || null,
        project_id: data.project_id || null,
        dcs: data.dcs || null,
        isDelayed: data.isDelayed || null,
        lead_id: data.lead_id || null,
        company_id: data.company_id || null,
        contact_id: data.contact_id || null,
        sale_person_id: data.sale_person_id || null,
        engineer_id: data.engineer_id || null,
        pipeline_type: data.pipeline_type || null,
        pipeline_status: pipeline_status,
        next_action: data.next_action || null,
        priority: data.priority || null,
        lead_status_id: data.lead_status_id || null,
        amount: data.amount || null,
        leadTeamId: data.leadTeamId || null,
        defaultAssignTeam: data.defaultAssignTeam || null,
        secondary_contact: data.secondary_contact
          ? JSON.stringify(data.secondary_contact)
          : null,
        secretId: data.secretId || null,
        leadNotesField: data.leadNotesField || null,
        requestedScope: data.requestedScope || null,
      };

      const lead = await leadServices.addLead(postData);

      if (data.leadTags && data.leadTags.length > 0) {
        const tags = data.leadTags.map((tagId) => ({
          lead_id: lead.id,
          tag_id: tagId,
        }));

        await leadTagsServices.addleadTags(tags);
      }

      if (data.leadTeamId) {
        // Fetch LeadTeam by ID
        const leadTeam = await db.leadTeamsObj.findOne({
          where: { id: data.leadTeamId },
        });

        let contactIds = [];
        if (leadTeam && leadTeam.contact_id) {
          try {
            contactIds = JSON.parse(leadTeam.contact_id);
          } catch (err) {
            console.error("Invalid contact_id JSON:", err);
          }
        }

        if (Array.isArray(contactIds) && contactIds.length > 0) {
          await leadServices.updateLeadTeamMember(contactIds, lead.id);
        }
      }

      return res.status(200).send({
        status: true,
        message: "Lead added successfully",
        data: lead,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.response?.data?.error || error.message || "Lead failed",
        data: error.response?.data || {},
      });
    }
  },

  /*getLeadById*/
  async getLeadById(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const leadId = req.query.id; // ✅ Pick the `id` directly
      if (!leadId) throw new Error("Lead ID is required");

      const lead = await leadServices.getLeadById(leadId);
      if (!lead) throw new Error("Lead not found");

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(lead, "Lead displayed successfully")
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Fetching leads failed",
        data: error.response?.data || {},
      });
    }
  },

  /*leadUpdate*/
  async leadUpdate(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const leadId = req.body.id || req.query.id;
      if (!leadId) throw new Error("Lead ID is required");

      const data = req.body;

      // Check lead exists
      const existingLead = await leadServices.getLeadById(leadId);
      if (!existingLead) throw new Error("Lead not found");

      // Build update data
      const postData = {
        date_record: data.date_record || null,
        due_date: data.due_date || null,
        nextStepDate: data.nextStepDate || null,
        project_id: data.project_id || null,
        dcs: data.dcs || null,
        isDelayed: data.isDelayed || null,
        company_id: data.company_id || null,
        contact_id: data.contact_id || null,
        sale_person_id: data.sale_person_id || null,
        engineer_id: data.engineer_id || null,
        pipeline_type: data.pipeline_type || null,
        pipeline_status: data.pipeline_status || null,
        next_action: data.next_action || null,
        priority: data.priority || null,
        lead_status_id: data.lead_status_id || null,
        amount: data.amount || null,
        leadTeamId: data.leadTeamId || null,
        defaultAssignTeam: data.defaultAssignTeam || null,
        secondary_contact: data.secondary_contact
          ? JSON.stringify(data.secondary_contact)
          : null,
        secretId: data.secretId || null,
        leadNotesField: data.leadNotesField || null,
        requestedScope: data.requestedScope
        ? JSON.stringify(data.requestedScope)
        : null,
      };

      // Update lead
      await leadServices.leadUpdate(postData, leadId);

      // Handle tags
      await leadTagsServices.deleteByLeadId(leadId);
      if (data.leadTags && data.leadTags.length > 0) {
        const tags = data.leadTags.map((tagId) => ({
          lead_id: leadId,
          tag_id: tagId,
        }));
        await leadTagsServices.addleadTags(tags);
      }

      // Handle lead team
      if (data.leadTeamId) {
        const leadTeam = await db.leadTeamsObj.findOne({
          where: { id: data.leadTeamId },
        });

        let contactIds = [];
        if (leadTeam?.contact_id) {
          try {
            contactIds = JSON.parse(leadTeam.contact_id);
          } catch (err) {
            console.error("Invalid contact_id JSON:", err);
          }
        }

        if (contactIds.length) {
          await leadServices.updateLeadTeamMember(contactIds, leadId);
        } else {
          await db.leadTeamsMemberObj.destroy({ where: { lead_id: leadId } });
        }
      } else {
        await db.leadTeamsMemberObj.destroy({ where: { lead_id: leadId } });
      }

      // Fetch updated lead
      const updatedLead = await leadServices.getLeadById(leadId);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            updatedLead,
            "Lead updated successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error || error.message || "Lead update failed",
        data: error.response?.data || {},
      });
    }
  },

  /*leadDelete*/
  async leadDelete(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let leadId = req.query.id;
      let lead = await leadServices.getLeadById(leadId);
      if (!lead) throw new Error("Lead not found");
      let leadDelete = await leadServices.leadDelete(leadId);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            leadDelete,
            "Lead deleted successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Getting leads failed",
        data: error.response?.data || {},
      });
    }
  },

  /*getAllLeadNotes*/
  async getAllLeadNotes(req, res) {
    try {
      let { page = 1, per_page, search, date, take_all, lead_id } = req.query;

      page = parseInt(page);
      per_page = parseInt(per_page) || 10;

      if (page <= 0 || per_page <= 0) {
        throw new Error("Page and per_page must be greater than 0");
      }

      if (!lead_id) {
        return res.status(400).json({
          status: false,
          message: "lead_id is required",
        });
      }

      let { notes, meta } = await leadServices.getAllLeadNotes(
        page,
        per_page,
        search,
        date,
        lead_id,
        take_all
      );

      return res.status(200).send({
        status: true,
        message: "Lead notes fetched successfully",
        data: notes,
        meta: meta,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Getting lead notes failed",
        data: error.response?.data || {},
      });
    }
  },

  /*addLeadtNotes*/
  async addLeadtNotes(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const { lead_id, notes } = req.body;

      if (!lead_id || !notes) {
        return res.status(400).json({
          status: false,
          message: "lead_id and notes are required",
        });
      }

      const postData = {
        user_id: req.userId, // comes from token
        lead_id,
        notes,
      };

      const LeadNotes = await leadServices.addLeadtNotes(postData);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            LeadNotes,
            "Lead notes added successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error || error.message || "Lead notes failed",
        data: error.response?.data || {},
      });
    }
  },

  /*updateLeadNotes*/
  async updateLeadNotes(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const { leadNoteId, notes } = req.body;

      if (!leadNoteId || !notes) {
        return res.status(400).json({
          status: false,
          message: "Lead note ID and notes are required",
        });
      }

      const updatedNote = await leadServices.updateLeadNotes(leadNoteId, notes);

      if (!updatedNote) {
        throw new Error("Lead note not found or update failed");
      }

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            updatedNote,
            "Lead note updated successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Failed to update lead note",
        data: {},
      });
    }
  },

  /*deleteLeadNotes*/
  async deleteLeadNotes(req, res) {
    try {
      const { leadNoteId } = req.query;

      if (!leadNoteId) {
        return res.status(400).json({
          status: false,
          message: "Lead note ID is required",
        });
      }

      const deleted = await leadServices.deleteLeadNotes(leadNoteId);

      if (!deleted) {
        throw new Error("Lead note not found or already deleted");
      }

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose({}, "Lead note deleted successfully")
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Failed to delete lead note",
        data: {},
      });
    }
  },

  /*updateLeadTeamMember*/
  async updateLeadTeamMember(req, res) {
    try {
      const { leadId } = req.query;
      const { members } = req.body;

      if (!leadId) {
        return res.status(400).json({
          status: false,
          message: "leadId is required",
        });
      }

      const lead = await db.leadsObj.findByPk(leadId);
      if (!lead) {
        return res.status(404).json({
          status: false,
          message: "Lead not found",
        });
      }

      if (!Array.isArray(members) || members.length === 0) {
        return res.status(400).json({
          status: false,
          message: "Members must be a non-empty array of user IDs",
        });
      }

      const updatedMembers = await leadServices.updateLeadTeamMember(
        members,
        leadId
      );

      return res.status(200).json({
        status: true,
        message: "Lead team member list updated successfully!",
        data: updatedMembers,
      });
    } catch (error) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(error));
      return res.status(500).json({
        status: false,
        message: error.message || "Failed to update lead team members",
      });
    }
  },

  /*getLeadTeamMembers*/
  async getLeadTeamMembers(req, res) {
    try {
      const { leadId } = req.query;

      if (!leadId) {
        return res.status(400).json({
          status: false,
          message: "leadId is required",
        });
      }

      const teamMembers = await leadServices.getLeadTeamMembers(leadId);

      if (!teamMembers || teamMembers.length === 0) {
        return res.status(404).json({
          status: false,
          message: "No team members found for this lead",
          data: [],
        });
      }

      // Format response
      const formattedMembers = teamMembers.map((member) => ({
        id: member.id, // lead_team_member id
        user_id: member.user_id, // FK user_id
        name: member.userData?.name, // from included user
        email: member.userData?.email,
      }));

      return res.status(200).json({
        status: true,
        message: "Lead team members fetched successfully!",
        data: formattedMembers,
      });
    } catch (error) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(error));
      return res.status(500).json({
        status: false,
        message: error.message || "Failed to fetch lead team members",
      });
    }
  },

  /*updateLeadDcs*/
  async updateLeadDcs(req, res) {
    try {
      const data = req.body;

      if (!data.id) {
        return res.status(400).json({
          status: false,
          message: "Lead ID is required",
        });
      }

      const lead = await db.leadsObj.findByPk(data.id);
      if (!lead) {
        return res.status(404).json({
          status: false,
          message: "Lead not found",
        });
      }

      const updatedLead = await leadServices.updateLeadDcs(data);

      return res.status(200).json({
        status: true,
        message: "Lead DCS updated successfully!",
        data: updatedLead,
      });
    } catch (error) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(error));
      return res.status(500).json({
        status: false,
        message: error.message || "Failed to update lead DCS",
      });
    }
  },

  /*getAllProjectDatatakeoffLead*/
  async getAllProjectDatatakeoffLead(req, res) {
    try {
      let { page = 1, per_page = 10, search = "" } = req.query;
      const userId = req.userId;

      page = parseInt(page);
      per_page = parseInt(per_page);

      if (page <= 0 || per_page <= 0) {
        return res.status(400).json({
          status: false,
          message: "Page and per_page must be greater than 0",
          data: {},
        });
      }
      const getAllProject = await leadServices.getAllProjectDatatakeoffLead(
        page,
        per_page,
        search,
        userId
      );

      if (!getAllProject || getAllProject.data.length === 0) {
        return res.status(404).json({
          status: false,
          message: "No projects found with takeoff_status 'lead list'",
          data: [],
        });
      }

      return res.status(200).json({
        status: true,
        message: "Projects with takeoff_status 'lead' fetched successfully",
        data: getAllProject.data,
        meta: getAllProject.meta,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Getting projects failed",
        data: {},
      });
    }
  },

  /*updateleadPriorty*/
  async updateleadPriorty(req, res) {
    try {
      const { takeoff_status, ids } = req.body;

      const updatePromises = ids.map((item) =>
        leadServices.updateLeadPriority(item.id, takeoff_status, item.priority)
      );

      await Promise.all(updatePromises);

      return res.status(200).json({
        status: true,
        message: "Lead priorities updated successfully",
      });
    } catch (error) {
      console.error("Error updating leads:", error);
      return res.status(400).json({
        status: false,
        message: error.message || "Updating lead priority failed",
        data: {},
      });
    }
  },

  /* validate */
  validate(method) {
    switch (method) {
      case "addLead": {
        return [
          check("project_id").notEmpty().withMessage("project is Required"),
        ];
      }
      case "getLeadById": {
        return [check("id").not().isEmpty().withMessage("LeadId is Required")];
      }
    }
  },
};
