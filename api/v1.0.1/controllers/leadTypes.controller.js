require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator");
const leadStatusesServices = require("../services/leadStatuses.services");
const { addleadType } = require("../services/leadTypes.services");
const leadTypesServices = require("../services/leadTypes.services");
const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return error.msg;
    },
});

module.exports = {
    /*addleadTypes*/
    async addleadType(req, res) {
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
            await leadTypesServices.addleadType(postData);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", "add lead Types successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "add lead Types failed",
                data: error.response?.data || {}
            });
        }

    },
    async getAllleadTypes(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }

            let { page = 1, per_page, search = "" } = req.query;
            page = parseInt(page);
            per_page = parseInt(per_page) || 10;

            const result = await leadTypesServices.getAllleadTypes({ page, per_page, search });

            return res
                .status(200)
                .send({
                    status: true,
                    message: "Lead Types fetched successfully",
                    data: result.data,
                    meta: result.meta
                });
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Get Lead Types failed",
                data: error.response?.data || {}
            });
        }
    }
    ,
    /* Get Lead Type by ID */
    async getleadTypeById(req, res) {
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

            const result = await leadTypesServices.getleadTypesById(id);

            return res
                .status(200)
                .send(
                    commonHelper.parseSuccessRespose(result, "Lead Type fetched successfully")
                );
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Get Lead Type failed",
                data: error.response?.data || {}
            });
        }
    },
    /* Delete Lead Type by ID */
    async deleteleadType(req, res) {
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

            await leadTypesServices.deleteleadTypes(id);

            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", "Lead Type deleted successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Delete Lead Type failed",
                data: error.response?.data || {}
            });
        }
    },
    /* Update Lead Type  */
    async updateleadTypes(req, res) {
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


            const result = await leadTypesServices.updateleadTypes(id, postData);

            return res
                .status(200)
                .send(
                    commonHelper.parseSuccessRespose(result, "Lead Type updated successfully")
                );
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Update Lead Type failed",
                data: error.response?.data || {},
            });
        }
    },

}
