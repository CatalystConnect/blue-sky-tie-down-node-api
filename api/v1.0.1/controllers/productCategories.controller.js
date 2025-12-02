require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator"); // Updated import
const unitsServices = require("../services/units.services");
const productCategoriesServices = require("../services/productCategories.services");
const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return error.msg;
    },
});

module.exports = {
    /*addProductCategories*/
    async addProductCategories(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }

            const postData = {
                user_id: req.userId,
                name: req.body.name,
              };
           
            
            const unit = await productCategoriesServices.addProductCategories(postData);

            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", "Product Categories added successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Product Categories failed",
                data: error.response?.data || {}
            });
        }
    },
     /*getAllProductCategories*/
     async getAllProductCategories(req, res) {
        try {
            const { page = 1, per_page , search = ""  } = req.query;
            let ProductCategories = await productCategoriesServices.getAllProductCategories({ page, per_page, search });
            if (!ProductCategories) {
                throw new Error("Product Categories not found");
            }
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(ProductCategories, "Product Categories displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Getting Product Categories failed",
                data: error.response?.data || {}
            });
        }
    },
     /*getProductCategoriesById*/
     async getProductCategoriesById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let productCategoriesId = req.query.id;
            let ProductCategories = await productCategoriesServices.getProductCategoriesById(productCategoriesId);
            if (!ProductCategories) {
                throw new Error("Product Categories not found");
            }
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(ProductCategories, "Product Categories displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Getting Product Categories failed",
                data: error.response?.data || {}
            });
        }
    },
     /*deleteProductCategories*/
     async deleteProductCategories(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let productCategoriesId = req.query.id;
            let productCategories = await productCategoriesServices.getProductCategoriesById(productCategoriesId);
            if (!productCategories) {
                throw new Error("product Categories not found");
            }
            let deleteUnit = await productCategoriesServices.deleteProductCategories(productCategoriesId);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(deleteUnit, "product Categories deleted successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "product Categories deletion failed",
                data: error.response?.data || {}
            });
        }
    },
     /*updateProductCategories*/
     async updateProductCategories(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let productCategoriesId = req.query.id;
            let ProductCategories = await productCategoriesServices.getProductCategoriesById(productCategoriesId);
            if (!ProductCategories) {
                throw new Error("Product Categories not found");
            }
            let data = req.body;
            let postData = {
                name: data.name,
            }
            
            let updateUnit = await productCategoriesServices.updateProductCategories(postData, productCategoriesId);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(updateUnit, " Product Categories updated successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Product Categories updation failed",
                data: error.response?.data || {}
            });
        }
    },

}
