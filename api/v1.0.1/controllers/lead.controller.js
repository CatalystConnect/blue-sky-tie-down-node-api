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
module.exports = {
  /*getAllLeads*/
  // async getAllLeads(req, res) {
  //   try {
  //     let {
  //       page = 1,
  //       length = 10,
  //       search,
  //       date,
  //       role_id,
  //       take_all,
  //     } = req.query;

  //     const userId = req.userId;
  //     const role = req.role;

  //     page = parseInt(page);
  //     length = parseInt(length);

  //     if (page <= 0 || length <= 0) {
  //       throw new Error("Page and length must be greater than 0");
  //     }

  //     let { leads, count } = await leadServices.getAllLeads(
  //       page,
  //       length,
  //       search,
  //       date,
  //       role_id,
  //       userId,
  //       role,
  //       take_all
  //     );

  //     let totalPages = Math.ceil(count / length);

  //     let response = {
  //       leads: leads,
  //       total: count,
  //       page,
  //       perPage: length,
  //       totalPages,
  //     };

  //     return res
  //       .status(200)
  //       .send(
  //         commonHelper.parseSuccessRespose(
  //           response,
  //           "Leads displayed successfully"
  //         )
  //       );
  //   } catch (error) {
  //     return res.status(400).json({
  //       status: false,
  //       message:
  //         error.response?.data?.error ||
  //         error.message ||
  //         "Getting leads failed",
  //       data: error.response?.data || {},
  //     });
  //   }
  // },
  async getAllLeads(req, res) {
    try {
      let {
        page = 1,
        length = 10,
        search,
        date,
        role_id,
        take_all,
      } = req.query;

      const userId = req.userId;
      const role = req.role;

      page = parseInt(page);
      length = parseInt(length);

      if (page <= 0 || length <= 0) {
        throw new Error("Page and length must be greater than 0");
      }

      let { leads, meta } = await leadServices.getAllLeads(
        page,
        length,
        search,
        date,
        role_id,
        userId,
        role,
        take_all
      );


      return res
        .status(200)
        .send({
          status: true,
          message: "Lead Types fetched successfully",
          data: leads,
          meta: meta
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

      let postData = {
        date_record: data.date_record || null,
        due_date: data.due_date || null,
        nextStepDate: data.nextStepDate || null,
        dcs: data.dcs || null,
        isDelayed: data.isDelayed || null,
        project_id: data.project_id || null,
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

      // check lead exists
      const existingLead = await leadServices.getLeadById(leadId);
      if (!existingLead) throw new Error("Lead not found");

      // build update data
      const postData = {
        date_record: data.date_record || null,
        due_date: data.due_date || null,
        nextStepDate: data.nextStepDate || null,
        dcs: data.dcs || null,
        isDelayed: data.isDelayed || null,
        project_id: data.project_id || null,
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
        requestedScope: data.requestedScope || null,
      };

      // update lead
      await leadServices.leadUpdate(postData, leadId);

      // delete old tags and insert new ones
      if (data.leadTags && data.leadTags.length > 0) {
        await leadTagsServices.deleteByLeadId(leadId); // ✅ remove old tags

        const tags = data.leadTags.map((tagId) => ({
          lead_id: leadId,
          tag_id: tagId,
        }));

        await leadTagsServices.addleadTags(tags);
      }

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            { id: leadId, ...postData },
            "Lead Updated successfully"
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
