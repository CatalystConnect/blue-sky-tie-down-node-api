require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator");
const ticketsServices = require("../services/tickets.services");
const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return error.msg;
    },
});

module.exports = {
    /* addTickets */
    async addTickets(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }

            let data = req.body;

            // uploaded file
            let fileData = null;
            let fileURL = null;
            if (req.file) {
                fileData = req.file.filename;
                fileURL = `files/${req.file.filename}`;
            }

            let postData = {
                user_id: req.userId,
                lead_id: data.lead_id,
                ticket_template_id: data.ticket_template_id,
                parentTicketId: data.parentTicketId,
                requiredToMoveStatus: data.requiredToMoveStatus || "true",
                ticket_status: data.ticket_status || "open",
                ticketGroupId: data.ticketGroupId,
                ticketSubjectId: data.ticketSubjectId,
                projectId: data.projectId,
                taskUrgencyId: data.taskUrgencyId,
                companyId: data.companyId,
                checklist: data.checklist,
                description: data.description,
                file: fileData,
                fileURL: fileURL,
                due_date: data.due_date,
                pipelineId: data.pipelineId,
                pipelineStatusId: data.pipelineStatusId,
                leadTags: data.leadTags,
                additional_info_on_status_change: data.additional_info_on_status_change,
                isPin: data.isPin || "false",
            };

            const result = await ticketsServices.addTickets(postData);

            return res
                .status(200)
                .send(
                    commonHelper.parseSuccessRespose(result, "Ticket created successfully")
                );
        } catch (error) {
            return res.status(400).json({
                status: false,
                message:
                    error.response?.data?.error ||
                    error.message ||
                    "Add Ticket failed",
                data: error.response?.data || {},
            });
        }
    },
    async getAllTickets(req, res) {
        try {
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;

            const result = await ticketsServices.getAllTickets(page, limit);

            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(result, "Tickets fetched successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message:
                    error.response?.data?.error || error.message || "Failed to fetch tickets",
                data: error.response?.data || {},
            });
        }
    },
    async getTicketsById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }

            const ticketId = req.query.id || req.body.id;
            if (!ticketId) {
                return res
                    .status(400)
                    .send(commonHelper.parseErrorRespose("Ticket ID is required"));
            }

            const result = await ticketsServices.getTicketsById(ticketId);

            if (!result) {
                return res
                    .status(404)
                    .send(commonHelper.parseErrorRespose("Ticket not found"));
            }

            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(result, "Ticket fetched successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message:
                    error.response?.data?.error ||
                    error.message ||
                    "Get Ticket failed",
                data: error.response?.data || {},
            });
        }
    },
    async deleteTickets(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }

            const ticketId = req.query.id || req.body.id;
            if (!ticketId) {
                return res
                    .status(400)
                    .send(commonHelper.parseErrorRespose("Ticket ID is required"));
            }

            const result = await ticketsServices.deleteTickets(ticketId);

            if (!result) {
                return res
                    .status(404)
                    .send(commonHelper.parseErrorRespose("Ticket not found"));
            }

            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose({}, "Ticket deleted successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message:
                    error.response?.data?.error ||
                    error.message ||
                    "Delete Ticket failed",
                data: error.response?.data || {},
            });
        }
    },
    async updateTickets(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }

            const { id } = req.query; // Ticket ID from query
            if (!id) {
                return res
                    .status(400)
                    .send(commonHelper.parseErrorRespose({ id: "Ticket ID is required" }));
            }

            let data = req.body;

            
            let fileData = null;
            let fileURL = null;
           if (req.file) {
                fileData = req.file.filename;
                fileURL = `files/${req.file.filename}`;
            }


            const postData = {
                lead_id: data.lead_id,
                ticket_template_id: data.ticket_template_id,
                parentTicketId: data.parentTicketId,
                requiredToMoveStatus: data.requiredToMoveStatus,
                ticket_status: data.ticket_status,
                ticketGroupId: data.ticketGroupId,
                ticketSubjectId: data.ticketSubjectId,
                projectId: data.projectId,
                taskUrgencyId: data.taskUrgencyId,
                companyId: data.companyId,
                checklist: data.checklist,
                description: data.description,
                file: fileData || undefined,
                fileURL: fileURL || undefined,
                due_date: data.due_date,
                pipelineId: data.pipelineId,
                pipelineStatusId: data.pipelineStatusId,
                leadTags: data.leadTags,
                additional_info_on_status_change: data.additional_info_on_status_change,
                isPin: data.isPin,
            };

            const result = await ticketsServices.updateTickets(id, postData);

            return res
                .status(200)
                .send(
                    commonHelper.parseSuccessRespose(result, "Ticket updated successfully")
                );
        } catch (error) {
            return res.status(400).json({
                status: false,
                message:
                    error.response?.data?.error ||
                    error.message ||
                    "Update Ticket failed",
                data: error.response?.data || {},
            });
        }
    },

};
