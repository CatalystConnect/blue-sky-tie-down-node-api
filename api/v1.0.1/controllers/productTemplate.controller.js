require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const productTemplateServices = require("../services/productTemplate.services");
const { check, validationResult } = require("express-validator"); // Updated import
const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return error.msg;
    },
});
const { ACCESS_MODULES } = require("../helper/constant");

module.exports = {
    /*addProductTemplate*/
    async addProductTemplate(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }

            const {
                template_code,
                name,
                description,
                is_active
            } = req.body;

            const postData = {
                template_code,
                name,
                description: description || null,
                is_active: is_active !== undefined ? is_active : true
            };

            await productTemplateServices.addProductTemplate(postData);

            return res
                .status(200)
                .send(
                    commonHelper.parseSuccessRespose(
                        postData,
                        "Product template added successfully"
                    )
                );

        } catch (error) {
            return res.status(400).json({
                status: false,
                message:
                    error.response?.data?.error ||
                    error.message ||
                    "Product template creation failed",
                data: error.response?.data || {},
            });
        }
    },
    async getAllProductTemplate(req, res) {
        try {
            const {
                page = 1,
                per_page = 10,
                search = "",
                is_active
            } = req.body;

            const result = await productTemplateServices.getAllProductTemplate({
                page,
                per_page,
                search,
                is_active
            });

            return res.status(200).send(
                commonHelper.parseSuccessRespose(
                    result,
                    "Product templates fetched successfully"
                )
            );

        } catch (error) {
            return res.status(400).json({
                status: false,
                message:
                    error.response?.data?.error ||
                    error.message ||
                    "Failed to fetch product templates",
                data: error.response?.data || {},
            });
        }
    },
    async getProductTemplateById(req, res) {
        try {
            const { id } = req.query;


            const result = await productTemplateServices.getProductTemplateById(id);

            if (!result) {
                return res.status(200).send(
                    commonHelper.parseErrorRespose(
                        {},
                        "Product template not found"
                    )
                );
            }

            return res.status(200).send(
                commonHelper.parseSuccessRespose(
                    result,
                    "Product template fetched successfully"
                )
            );

        } catch (error) {
            return res.status(400).json({
                status: false,
                message:
                    error.response?.data?.error ||
                    error.message ||
                    "Failed to fetch product template",
                data: error.response?.data || {},
            });
        }
    },
    async updateProductTemplate(req, res) {
        try {
            const { id } = req.query;



            const {
                template_code,
                name,
                description,
                is_active
            } = req.body;

            const updateData = {};

            if (template_code !== undefined) updateData.template_code = template_code;
            if (name !== undefined) updateData.name = name;
            if (description !== undefined) updateData.description = description;
            if (is_active !== undefined) updateData.is_active = is_active;

            if (Object.keys(updateData).length === 0) {
                return res.status(200).send(
                    commonHelper.parseErrorRespose(
                        {},
                        "No fields provided to update"
                    )
                );
            }

            const result = await productTemplateServices.updateProductTemplate(
                id,
                updateData
            );

            if (!result) {
                return res.status(200).send(
                    commonHelper.parseErrorRespose({}, "Product template not found")
                );
            }

            return res.status(200).send(
                commonHelper.parseSuccessRespose(
                    result,
                    "Product template updated successfully"
                )
            );

        } catch (error) {
            return res.status(400).json({
                status: false,
                message:
                    error.response?.data?.error ||
                    error.message ||
                    "Product template update failed",
                data: error.response?.data || {},
            });
        }
    },
    async deleteProductTemplate(req, res) {
        try {
            const { id } = req.query;

            

            const result = await productTemplateServices.deleteProductTemplate(id);

            if (!result) {
                return res.status(200).send(
                    commonHelper.parseErrorRespose({}, "Product template not found")
                );
            }

            return res.status(200).send(
                commonHelper.parseSuccessRespose(
                    {},
                    "Product template deleted successfully"
                )
            );

        } catch (error) {
            return res.status(400).json({
                status: false,
                message:
                    error.response?.data?.error ||
                    error.message ||
                    "Product template delete failed",
                data: error.response?.data || {},
            });
        }
    }





}