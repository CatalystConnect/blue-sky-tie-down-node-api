require("dotenv").config();
const { col } = require("sequelize");
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator");
const projectPhasesServices = require("../services/projectPhases.services");
const projectTagsServices = require("../services/projectTags.services");
const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return error.msg;
    },
});

module.exports = {
    /*addProductTags*/
    async addProductTags(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }

            const postData = {
                name: req.body.name,
                order:req.body.order
          
            };

            const projectTags = await projectTagsServices.addProductTags(postData);

            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", "add project Tags successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "add project Tags failed",
                data: error.response?.data || {}
            });
        }
    },
    /*getAllProductTags*/
    async getAllProductTags(req, res) {
        try {
            const { page = 1, per_page = 10, search = "" } = req.query;

            
            let ProductTags = await projectTagsServices.getAllProductTags({
                page: parseInt(page),
                per_page: parseInt(per_page),
                search,
              
            });

            return res.status(200).send({
                status: true,
                message: "Record Found",
                data: ProductTags.data,
                meta: ProductTags.meta
            });
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.message || "Getting Tags failed",
                data: {}
            });
        }
    },
    /*getProductTagsById*/
    async getProductTagsById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let id = req.query.id;
            let ProductTags = await projectTagsServices.getProductTagsById(id);
            if (!ProductTags) {
                throw new Error("project Tags  not found");
            }
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(ProductTags, "project Tags  displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Getting Tags failed",
                data: error.response?.data || {}
            });
        }
    },
    /*deleteProductTags*/
    async deleteProductTags(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let id = req.query.id;
            let projectPhases = await projectTagsServices.getProductTagsById(id);
            if (!projectPhases) {
                throw new Error("project Phases   not found");
            }
            let projectPhase = await projectTagsServices.deleteProductTags(id);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(projectPhase, "project tags deleted successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "project tags  deletion failed",
                data: error.response?.data || {}
            });
        }
    },
    /*updateProductTags*/
    async updateProductTags(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let id = req.query.id;
            let projectPhases = await projectTagsServices.getProductTagsById(id);
            if (!projectPhases) {
                throw new Error("project Phases  not found");
            }
            let data = req.body;
            let postData = {

                name: data.name,
                order: data.order,
                
            }

            let updateProductTags = await projectTagsServices.updateProductTags(id, postData);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(updateProductTags, "update Product Tags successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "update Product Tags  updation failed",
                data: error.response?.data || {}
            });
        }
    },
    // validate(method) {
    //     switch (method) {
    //         case "addTags": {
    //             return [
    //                 check("title").not().isEmpty().withMessage("Title is Required")
    //             ];
    //         }
    //         case "updateTags": {
    //             return [
    //                 check("title").not().isEmpty().withMessage("Title is Required")
    //             ];
    //         }
    //     }
    // }

}
