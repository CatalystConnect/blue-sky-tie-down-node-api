require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const attributeServices = require("../services/attribute.services");
const { check, validationResult } = require("express-validator"); // Updated import
const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return error.msg;
    },
});

module.exports = {
    /*addAttribute*/
    async addAttribute(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let data = req.body;
            let postData = {
                name: data.name,
                slug: data.slug
            }
            await attributeServices.addAttribute(postData);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", "Attribute add successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Adding attribute failed",
                data: error.response?.data || {}
            });
        }
    },
    /*getAllAttributes*/
    async getAllAttributes(req, res) {
        try {
            let { page, length } = req.query;
            if (page <= 0 || length <= 0) {
                throw new Error("Page and length must be greater than 0");
            }
            let attributes = await attributeServices.getAllAttributes(page, length);
            let totalAttributes = await attributeServices.getTotalAttributes(page, length);
            let response = {
            attributes: attributes,
            totalRecords: totalAttributes.length
            }
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(response, "Attributes displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Fetching attributes failed",
                data: error.response?.data || {}
            });
        }

    },
    /*getAttributesById*/
    async getAttributesById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let attributeId = req.query.attributeId;
            let attribute = await attributeServices.getAttributesById(attributeId);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(attribute, "Attribute displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Fetching attributes failed",
                data: error.response?.data || {}
            });
        }

    },
    /*updateAttributesById*/
    async updateAttributesById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let attributeId = req.query.attributeId;
            let attribute = await attributeServices.getAttributesById(attributeId);
            if(!attribute) throw new Error("Attribute not found");
            let data = req.body;
            let postData = {
                name: data.name,
                slug: data.slug
            }
            commonHelper.removeFalsyKeys(postData);
            let updateAttribute = await attributeServices.updateAttributesById(postData, attributeId);            
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(updateAttribute, "Attribute updated successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Updating attributes failed",
                data: error.response?.data || {}
            });
        }
    },
    /*deleteAttributesById*/
    async deleteAttributesById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let attributeId = req.query.attributeId;
            let attribute = await attributeServices.getAttributesById(attributeId);
            if(!attribute) throw new Error("Attribute not found");
            let deleteAttribute = await attributeServices.deleteAttribute(attributeId);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(deleteAttribute, "Attribute deleted successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Deleting attributes failed",
                data: error.response?.data || {}
            });
        }

    },

    validate(method) {
        switch (method) {
            case "getAttributesById": {
                return [
                    check("attributeId").not().isEmpty().withMessage("Attribute is required"),
                ];
            }
        }
    }
};
