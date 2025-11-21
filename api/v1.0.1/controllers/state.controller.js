require("dotenv").config();
const { col } = require("sequelize");
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator");
const projectPhasesServices = require("../services/projectPhases.services");
const projectTagsServices = require("../services/projectTags.services");
const stateServices = require("../services/state.services");
const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return error.msg;
    },
});

module.exports = {
    /*addState*/
    async addState(req, res) {
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

            const state = await stateServices.addState(postData);

            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", "add state successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "add state  failed",
                data: error.response?.data || {}
            });
        }
    },
    /*getAllState*/
    async getAllState(req, res) {
        try {
            const { page = 1, per_page = 10, search = "",id  } = req.query;

            
            let state = await stateServices.getAllState({
                page: parseInt(page),
                per_page: parseInt(per_page),
                search,
                id
              
            });

            return res.status(200).send({
                status: true,
                message: "Record Found",
                data: state.data,
                meta: state.meta
            });
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.message || "Getting Tags failed",
                data: {}
            });
        }
    },
    /*getStateById*/
    async getStateById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let id = req.query.id;
            let state = await stateServices.getStateById(id);
            if (!state) {
                throw new Error("state  not found");
            }
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(state, "state  displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Getting state failed",
                data: error.response?.data || {}
            });
        }
    },
    /*deleteState*/
    async deleteState(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let id = req.query.id;
            let state = await stateServices.getStateById(id);
            if (!state) {
                throw new Error("state   not found");
            }
            let states = await stateServices.deleteState(id);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(states, "state deleted successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || " state deletion failed",
                data: error.response?.data || {}
            });
        }
    },
    /*updateState*/
    async updateState(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let id = req.query.id;
            let state = await stateServices.getStateById(id);
            if (!state) {
                throw new Error("state not found");
            }
            let data = req.body;
            let postData = {

                name: data.name,
                order: data.order,
                
            }

            let updatestate = await stateServices.updateState(id, postData);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(updatestate, "update  state successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || " state updation failed",
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
