require("dotenv").config();
const { col } = require("sequelize");
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator");
const projectPhasesServices = require("../services/projectPhases.services");
const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return error.msg;
    },
});

module.exports = {
    /*addProductPhases*/
    async addProductPhases(req, res) {
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

            const addProductPhases = await projectPhasesServices.addProductPhases(postData);

            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", "add Product Phases successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "add Product Phases failed",
                data: error.response?.data || {}
            });
        }
    },
    /*getAllProductPhases*/
    async getAllProductPhases(req, res) {
        try {
            const { page = 1, per_page = 10, search = "" } = req.query;

            
            let ProductPhases = await projectPhasesServices.getAllProductPhases({
                page: parseInt(page),
                per_page: parseInt(per_page),
                search,
              
            });

            return res.status(200).send({
                status: true,
                message: "Record Found",
                data: ProductPhases.data,
                meta: ProductPhases.meta
            });
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.message || "Getting Tags failed",
                data: {}
            });
        }
    },
    /*getProductPhasesById*/
    async getProductPhasesById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let id = req.query.id;
            let projectPhases = await projectPhasesServices.getProductPhasesById(id);
            if (!projectPhases) {
                throw new Error("project Phases  not found");
            }
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(projectPhases, "project Phases  displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Getting Tag failed",
                data: error.response?.data || {}
            });
        }
    },
    /*deleteproductPhases*/
    async deleteproductPhases(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let id = req.query.id;
            let projectPhases = await projectPhasesServices.getProductPhasesById(id);
            if (!projectPhases) {
                throw new Error("Tag  not found");
            }
            let projectPhase = await projectPhasesServices.deleteproductPhases(id);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(projectPhase, "project Phases deleted successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "project Phases  deletion failed",
                data: error.response?.data || {}
            });
        }
    },
    /*updateProductPhases*/
    async updateProductPhases(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let id = req.query.id;
            let projectPhases = await projectPhasesServices.getProductPhasesById(id);
            if (!projectPhases) {
                throw new Error("project Phases  not found");
            }
            let data = req.body;
            let postData = {

                name: data.name,
                order: data.order,
                
            }

            let updateProductPhases = await projectPhasesServices.updateProductPhases(id, postData);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(updateProductPhases, "update Product Phases  successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "update Product Phases  updation failed",
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
