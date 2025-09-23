require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const configAttributeServices = require("../services/configureAttribute.services");
const attributeServices = require("../services/attribute.services");
const { check, validationResult } = require("express-validator");
const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return error.msg;
    },
});

module.exports = {
    /*addConfigureAttribute*/
    async addConfigureAttribute(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let data = req.body;
            for (const item of data) {
            let attribute = await attributeServices.getAttributesById(item.attributeId);
            if(attribute){
            let postData = {
                attributeId: item.attributeId,
                name: item.name,
                slug: item.slug,
                description: item.description
            }
            await configAttributeServices.addConfigureAttribute(postData);
        }else{
            throw new Error(`Attribute with ID ${item.attributeId} does not exist.`);
        }
        }
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", "ConfigAttribute add successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Adding attribute failed",
                data: error.response?.data || {}
            });
        }
    },
    /*getAllConfigAttributes*/
    async getAllConfigAttributes(req, res) {
        try {
            let { page, length } = req.query;
            if (page <= 0) {
                throw new Error("Page number must be greater than 0");
            }
            if (length <= 0) {
                throw new Error("Length number must be greater than 0");
            }
            let attributeId = req.query.attributeId;
            let attributes = await configAttributeServices.getAllConfigAttributes(page, length, attributeId);
            let totalAttributes = await configAttributeServices.getTotalConfigAttributes(attributeId);
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
    /*getConfigAttributesById*/
    async getConfigAttributesById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let configAttributeId = req.query.configAttributeId;
            let attribute = await configAttributeServices.getConfigAttributesById(configAttributeId);
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
    /*updateConfigAttributesById*/
    async updateConfigAttributesById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let configAttributeId = req.query.configAttributeId;
            let attribute = await configAttributeServices.getConfigAttributesById(configAttributeId);
            if(!attribute){
                throw new Error("Attribute not found");
            }
            let data = req.body;
            let postData = {
                name: data.name,
                slug: data.slug,
                description: data.description
            }
            commonHelper.removeFalsyKeys(postData);
            let updateAttribute = await configAttributeServices.updateConfigAttributesById(postData, configAttributeId);            
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
    /*deleteConfigAttributesById*/
    async deleteConfigAttributesById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let configAttributeId = req.query.configAttributeId;
            let attribute = await configAttributeServices.getConfigAttributesById(configAttributeId);
            if(!attribute){
                throw new Error("Attribute not found");
            }
            let deleteAttribute = await configAttributeServices.deleteConfigAttribute(configAttributeId);
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
            case "getConfigAttributesById": {
                return [
                    check("configAttributeId").not().isEmpty().withMessage("Attribute is Required"),
                ];
            }
            case "getAllConfigAttributes": {
                return [
                    check("attributeId").not().isEmpty().withMessage("Attribute is Required"),
                ];
            }
        }
    }
};
