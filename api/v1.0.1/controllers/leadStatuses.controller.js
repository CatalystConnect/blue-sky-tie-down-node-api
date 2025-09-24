require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator");
const leadStatusesServices = require("../services/leadStatuses.services");
const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return error.msg;
    },
});

module.exports = {
    /*addleadStatuses*/
    async addleadStatuses(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let data = req.body;

            let postData = {
                user_id: req.userId,
                title: data.title,
                color: data.color,
            }
            await leadStatusesServices.addleadStatuses(postData);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", "add lead Statuses  successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "add lead Statuses failed",
                data: error.response?.data || {}
            });
        }

    },
    async getAllleadStatuses(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }

            let { page = 1, limit = 10, search = "" } = req.query;
            page = parseInt(page);
            limit = parseInt(limit);

            const result = await leadStatusesServices.getAllleadStatuses({ page, limit, search });

            return res
                .status(200)
                .send({
                    status: true,
                    message: "Lead Statuses fetched successfully",
                    data: result.data,
                    meta: result.meta
                });
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Get Lead Statuses failed",
                data: error.response?.data || {}
            });
        }
    }
    ,
    /* Get Lead Status by ID */
    async getleadStatusesById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }

            const { id } = req.query;
            if (!id) {
                return res.status(200).send(
                    commonHelper.parseErrorRespose({ id: "ID is required" })
                );
            }

            const result = await leadStatusesServices.getleadStatusesById(id);

            return res
                .status(200)
                .send(
                    commonHelper.parseSuccessRespose(result, "Lead Status fetched successfully")
                );
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Get Lead Status failed",
                data: error.response?.data || {}
            });
        }
    },
    /* Delete Lead Status by ID */
    async deleteleadStatuses(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }

            const { id } = req.query;
            if (!id) {
                return res.status(200).send(
                    commonHelper.parseErrorRespose({ id: "ID is required" })
                );
            }

            await leadStatusesServices.deleteleadStatuses(id);

            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", "Lead Status deleted successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Delete Lead Status failed",
                data: error.response?.data || {}
            });
        }
    },
    /* Update Lead Status */
    async updateleadStatuses(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }

            const { id } = req.query;
            if (!id) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose({ id: "ID is required" }));
            }

            const data = req.body;

            const postData = {
                title: data.title,
                color: data.color,
                user_id: req.userId,
            };


            const result = await leadStatusesServices.updateleadStatuses(id, postData);

            return res
                .status(200)
                .send(
                    commonHelper.parseSuccessRespose(result, "Lead Status updated successfully")
                );
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Update Lead Status failed",
                data: error.response?.data || {},
            });
        }
    },

}
