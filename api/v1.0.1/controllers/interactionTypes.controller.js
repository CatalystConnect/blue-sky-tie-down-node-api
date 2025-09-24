require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator");
const leadStatusesServices = require("../services/leadStatuses.services");
const interactionTypesServices = require("../services/interactionTypes.services");
const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return error.msg;
    },
});

module.exports = {
    /*addinteractionTypes*/
    async addinteractionTypes(req, res) {
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
                name: data.name,

            }
            await interactionTypesServices.addinteractionTypes(postData);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", "add interaction Types successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "add interaction Types failed",
                data: error.response?.data || {}
            });
        }

    },
    async getAllinteractionTypes(req, res) {
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

            const result = await interactionTypesServices.getAllInteractionTypes({ page, limit, search });

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
                message: error.response?.data?.error || error.message || "Get Interaction Types failed",
                data: error.response?.data || {}
            });
        }
    },
    /* Get Interaction Type by ID */
    async getinteractionTypesById(req, res) {
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

            const result = await interactionTypesServices.getInteractionTypeById(id);

            return res
                .status(200)
                .send(
                    commonHelper.parseSuccessRespose(result, "Interaction Type fetched successfully")
                );
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Get Interaction Type failed",
                data: error.response?.data || {}
            });
        }
    },
    /* Delete Interaction Type by ID */
    async deleteinteractionTypes(req, res) {
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

            await interactionTypesServices.deleteInteractionType(id);

            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", "Interaction Type deleted successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Delete Interaction Type failed",
                data: error.response?.data || {}
            });
        }
    },
    /* Update Interaction Type */
    async updateinteractionTypes(req, res) {
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
                name: data.name,
                user_id: req.userId,
            };

            const result = await interactionTypesServices.updateInteractionType(id, postData);

            return res
                .status(200)
                .send(
                    commonHelper.parseSuccessRespose(result, "Interaction Type updated successfully")
                );
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Update Interaction Type failed",
                data: error.response?.data || {},
            });
        }
    },

}
