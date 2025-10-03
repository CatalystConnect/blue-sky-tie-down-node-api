require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator"); // Updated import
const leadTagsServices = require("../services/leadTags.services");
const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return error.msg;
    },
});

module.exports = {
    /*addleadTags*/
    async addleadTags(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let data = req.body;

            let postData = {
                lead_id: data.lead_id,
                tag_id: data.tag_id
            }
            await leadTagsServices.addleadTags(postData);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", "add Departments  successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Add Departments failed",
                data: error.response?.data || {}
            });
        }

    },
    /* Get All Lead Tags with pagination */
    async getAllleadTags(req, res) {
        try {
            let { page = 1, per_page, search } = req.query;

            page = parseInt(page);
            per_page = parseInt(per_page);

            if (isNaN(page) || page < 1) page = 1;
            if (isNaN(per_page) || per_page < 1) per_page = 10;

            const result = await leadTagsServices.getAllleadTags({ page, per_page, search });

            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(result, "Lead Tags fetched successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Fetch Lead Tags failed",
                data: error.response?.data || {},
            });
        }
    },
    /* Get Lead Tag by ID with joined Lead & Tag */
    async getleadTagsById(req, res) {
        try {
            const { id } = req.query;

            if (!id) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose({ id: "ID is required" }));
            }

            const leadTag = await leadTagsServices.getleadTagsById(id);

            if (!leadTag) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose({ id: "Lead Tag not found" }));
            }

            return res
                .status(200)
                .send(
                    commonHelper.parseSuccessRespose(leadTag, "Lead Tag fetched successfully")
                );
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.message || "Fetch Lead Tag failed",
                data: {},
            });
        }
    },
    /* Delete Lead Tag by ID */
    async deleteleadTags(req, res) {
        try {
            const { id } = req.query;

            if (!id) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose({ id: "ID is required" }));
            }

            const deleted = await leadTagsServices.deleteleadTags(id);

            if (!deleted) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose({ id: "Lead Tag not found" }));
            }

            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", "Lead Tag deleted successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.message || "Delete Lead Tag failed",
                data: {},
            });
        }
    },
    /* Update Lead Tag by ID */
    async updateleadTags(req, res) {
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
                lead_id: data.lead_id,
                tag_id: data.tag_id,
            };

            const updatedLeadTag = await leadTagsServices.updateleadTags(id, postData);

            return res
                .status(200)
                .send(
                    commonHelper.parseSuccessRespose(updatedLeadTag, "Lead Tag updated successfully")
                );
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.message || "Update Lead Tag failed",
                data: {},
            });
        }
    },
}