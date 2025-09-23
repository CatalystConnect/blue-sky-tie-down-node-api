require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const projectServices = require("../services/project.services");
const { check, validationResult } = require("express-validator"); // Updated import
const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return error.msg;
    },
});

module.exports = {
    /*addProject*/
    async addProject(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let data = req.body;
            let postData = {
                projectName: data.projectName,
                latitude: data.latitude,
                longitude: data.longitude,
                price: data.price,
                address: data.address,
                state: data.state,
                city: data.city,
                zip: data.zip,
                scope: data.scope,
                description: data.description,
                location: data.location
            }
            await projectServices.addProject(postData);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", "Project added successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Project failed",
                data: error.response?.data || {}
            });
        }
    },
    /*getAllProject*/
    async getAllProject(req, res) {
        try {
            let { page, length } = req.query;
            if (page <= 0 || length <= 0) {
                throw new Error("Page and length must be greater than 0");
            }
            let getAllProject = await projectServices.getAllProject(page, length);
            if (!getAllProject) throw new Error("Projects not found");
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(getAllProject, "Projects displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Getting projects failed",
                data: error.response?.data || {}
            });
        }
    },
    /*getProjectById*/
    async getProjectById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let projectId = req.query.projectId;
            let getProjectById = await projectServices.getProjectById(projectId);
            if (!getProjectById) throw new Error("Project not found");
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(getProjectById, "Project displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Getting project failed",
                data: error.response?.data || {}
            });
        }
    },
    /*updateProject*/
    async updateProject(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let projectId = req.query.projectId;
            let getProjectById = await projectServices.getProjectById(projectId);
            if (!getProjectById) throw new Error("Project not found");
            let data = req.body;
            let postData = {
                projectName: data.projectName,
                latitude: data.latitude,
                longitude: data.longitude,
                price: data.price,
                address: data.address,
                state: data.state,
                city: data.city,
                zip: data.zip,
                scope: data.scope,
                description: data.description,
                location: data.location
            }
            commonHelper.removeFalsyKeys(postData);
            let updateProject = await projectServices.updateProject(postData, projectId);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(updateProject, "Project updated successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Project updation failed",
                data: error.response?.data || {}
            });
        }
    },
    /*deleteProject*/
    async deleteProject(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let projectId = req.query.projectId;
            let getProjectById = await projectServices.getProjectById(projectId);
            if (!getProjectById) throw new Error("Project not found");
            let deleteProject = await projectServices.deleteProject(projectId);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(deleteProject, "Project deleted successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Project deletion failed",
                data: error.response?.data || {}
            });
        }
    },
    validate(method) {
        switch (method) {
            case "addProject": {
                return [
                    check("projectName").not().isEmpty().withMessage("ProjectName is Required"),
                    check("scope").not().isEmpty().withMessage("Scope is Required"),
                    check("address").not().isEmpty().withMessage("Address is Required")

                ]
            }
            case "getProjectById": {
                return [
                    check("projectId").not().isEmpty().withMessage("ProjectId is Required")
                ];
            }
        }
    }
};
