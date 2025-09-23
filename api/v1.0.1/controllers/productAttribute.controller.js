require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const productAttributeServices = require("../services/productAttribute.services");
const catalogServices = require("../services/catalog.services");
const { check, validationResult } = require("express-validator");
const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return error.msg;
    },
});

module.exports = {
    /*addProductAttribute*/
    async addProductAttribute(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let data = req.body;
            for (const item of data) {
                let value;
                if (item.value) {
                    value = JSON.stringify(item.value);
                }
                const productExists = await catalogServices.getCatalogById(item.productId);
                if (productExists) {
                    let postData = {
                        productId: item.productId,
                        name: item.name,
                        value: value
                    };
                    await productAttributeServices.addProductAttribute(postData);
                } else {
                    throw new Error(`Product with ID ${item.productId} does not exist.`);
                }
            }
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", "ProductAttribute add successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Adding attribute failed",
                data: error.response?.data || {}
            });
        }
    },
    /*getAllProductAttributes*/
    async getAllProductAttributes(req, res) {
        try {
            let { page, length } = req.query;
            if (page <= 0 || length <= 0) {
                throw new Error("Page and length must be greater than 0");
            }
            let attributes = await productAttributeServices.getAllProductAttributes(page, length);
            attributes.forEach(element => {
                if (element.value) {
                    element.value = JSON.parse(element.value)
                }
            });
            let totalAttributes = await productAttributeServices.getTotalProductAttributes();
            let response = {
                productAttributes: attributes,
                totalRecords: totalAttributes.length
            }
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(response, "ProductAttributes displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Fetching ProductAttributes failed",
                data: error.response?.data || {}
            });
        }

    },
    /*getProductAttributesById*/
    async getProductAttributesById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let productAttributeId = req.query.productAttributeId;
            let attribute = await productAttributeServices.getProductAttributesById(productAttributeId);
            if (attribute.value) {
                attribute.value = JSON.parse(attribute.value)
            }
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(attribute, "ProductAttribute displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Fetching attributes failed",
                data: error.response?.data || {}
            });
        }

    },
    /*updateProductAttributesById*/
    async updateProductAttributesById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let productAttributeId = req.query.productAttributeId;
            let attribute = await productAttributeServices.getProductAttributesById(productAttributeId);
            if (!attribute) throw new Error("ProductAttribute not found");
            let data = req.body;
            let value;
            if (data.value) {
                value = JSON.stringify(data.value)
            }
            let postData = {
                name: data.name,
                value: value
            }
            commonHelper.removeFalsyKeys(postData);
            let updateAttribute = await productAttributeServices.updateProductAttributesById(postData, productAttributeId);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(updateAttribute, "ProductAttribute updated successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Updating attributes failed",
                data: error.response?.data || {}
            });
        }
    },
    /*deleteProductAttributesById*/
    async deleteProductAttributesById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let productAttributeId = req.query.productAttributeId;
            let attribute = await productAttributeServices.getProductAttributesById(productAttributeId);
            if (!attribute) throw new Error("ProductAttribute not found");
            let deleteAttribute = await productAttributeServices.deleteProductAttributesById(productAttributeId);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(deleteAttribute, "ProductAttribute deleted successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Deleting attributes failed",
                data: error.response?.data || {}
            });
        }

    },
    /*getAttributesByProductId*/
    async getAttributesByProductId(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let productId = req.query.productId;
            let product = await productAttributeServices.getProduct(productId);
            if (!product) throw new Error("Product not found");
            let getAttributesByProductId = await productAttributeServices.getAttributesByProductId(productId);
            getAttributesByProductId.forEach(element => {
                element.value = JSON.parse(element.value)
            })
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(getAttributesByProductId, "ProductAttribute displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Fetching attributes failed",
                data: error.response?.data || {}
            });
        }

    },

    validate(method) {
        switch (method) {
            case "getProductAttributesById": {
                return [
                    check("productAttributeId").not().isEmpty().withMessage("ProductAttribute Id is Required"),
                ];
            }
            case "getAttributesByProductId": {
                return [
                    check("productId").not().isEmpty().withMessage("ProductId is Required"),
                ];
            }
        }
    }
};
