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
            // const errors = myValidationResult(req);
            // if (!errors.isEmpty()) {
            //     return res
            //         .status(200)
            //         .send(commonHelper.parseErrorRespose(errors.mapped()));
            // }
            let data = req.body;
            let postData = {
                user_id: req.userId,
                site_plan_id: data.site_plan_id,
                engineer_id: data.engineer_id,
                name: data.name,
                address: data.address,
                zip: data.zip,
                units: data.units,
                projectType: data.projectType,
                project_phase: data.project_phase,
                date_received: data.date_received,
                rev_status: data.rev_status,
                plan_reviewed_date: data.plan_reviewed_date,
                plan_reviewed_by: data.plan_reviewed_by,
                plan_revision_notes: data.plan_revision_notes,
                data_collocated_date: data.data_collocated_date,
                bldgs: data.bldgs,
                wind_zone: data.wind_zone,
                seismic_zone: data.seismic_zone,
                developer_id: data.developer_id,
                general_contractor_id: data.general_contractor_id,
                assign_to_budget: data.assign_to_budget,
                take_off_team_id: data.take_off_team_id,
                take_off_type: data.take_off_type,
                take_off_scope: data.take_off_scope,
                assign_date: data.assign_date,
                plan_link: data.plan_link,
                submissionType: data.submissionType,
                planFiles: data.planFiles,
                projectTags: data.projectTags,
                projectFiles: data.projectFiles,
                architecture: data.architecture,
                takeoffactualtime: data.takeoffactualtime,
                dueDate: data.dueDate,
                projectAttachmentUrls: data.projectAttachmentUrls,
                attachmentsLink: data.attachmentsLink,
                projectRifFields: data.projectRifFields 
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
    // /*getAllProject*/
    async getAllProject(req, res) {
        try {
            let { page, length,search } = req.query;
            if (page <= 0 || length <= 0) {
                throw new Error("Page and length must be greater than 0");
            }
            let getAllProject = await projectServices.getAllProject(page, length,search);
            if (!getAllProject) throw new Error("Projects not found");
            return res.status(200).send({
                status: true,
                message: " Get all Projects",
                data: getAllProject.data,
                meta: getAllProject.meta
            });
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Getting projects failed",
                data: error.response?.data || {}
            });
        }
    },
    // /*getProjectById*/
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
    // /*updateProject*/
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
                user_id: req.userId,
                site_plan_id: data.site_plan_id,
                engineer_id: data.engineer_id,
                name: data.name,
                address: data.address,
                zip: data.zip,
                units: data.units,
                projectType: data.projectType,
                project_phase: data.project_phase,
                date_received: data.date_received,
                rev_status: data.rev_status,
                plan_reviewed_date: data.plan_reviewed_date,
                plan_reviewed_by: data.plan_reviewed_by,
                plan_revision_notes: data.plan_revision_notes,
                data_collocated_date: data.data_collocated_date,
                bldgs: data.bldgs,
                wind_zone: data.wind_zone,
                seismic_zone: data.seismic_zone,
                developer_id: data.developer_id,
                general_contractor_id: data.general_contractor_id,
                assign_to_budget: data.assign_to_budget,
                take_off_team_id: data.take_off_team_id,
                take_off_type: data.take_off_type,
                take_off_scope: data.take_off_scope,
                assign_date: data.assign_date,
                plan_link: data.plan_link,
                submissionType: data.submissionType,
                planFiles: data.planFiles,
                projectTags: data.projectTags,
                projectFiles: data.projectFiles,
                architecture: data.architecture,
                takeoffactualtime: data.takeoffactualtime,
                dueDate: data.dueDate,
                projectAttachmentUrls: data.projectAttachmentUrls,
                attachmentsLink: data.attachmentsLink,
                projectRifFields: data.projectRifFields 
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
    // /*deleteProject*/
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
    // validate(method) {
    //     switch (method) {
    //         case "getProjectById": {
    //             return [
    //                 check("projectId").not().isEmpty().withMessage("ProjectId is Required")
    //             ];
    //         }
    //     }
    // }
};
