require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const applyWorkOrdersServices = require("../services/applyWorkOrders.services");
const workOrderServices = require("../services/workOrder.services");
const projectServices = require("../services/project.services");
const { check, validationResult } = require("express-validator"); // Updated import
const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return error.msg;
    },
});

module.exports = {
    /*addApplyWorkOrder*/
    async addApplyWorkOrder(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            const baseUrl = "/public/files/";
            let image = req.file ? `${baseUrl}${req.file.filename}` : null;
            let data = req.body;
            let findWorkOrder = await workOrderServices.getOrderById(data.workOrderId);
            if (!findWorkOrder) throw new Error("Work order not found");
            let findContractor = await applyWorkOrdersServices.findContractor(data.contractorId);
            if (!findContractor) throw new Error("Contractor not found");
            let rejectedContractor = await applyWorkOrdersServices.rejectedContractor(data.workOrderId, data.contractorId);

            if (rejectedContractor) throw new Error("You are rejected on this workOrder");
            let alreadyApply = await applyWorkOrdersServices.alreadyApply(data.workOrderId, data.contractorId);
            if (alreadyApply) throw new Error("You already apply on this workOrder");
            let postData = {
                workOrderId: data.workOrderId,
                contractorId: data.contractorId,
                description: data.description,
                projectName: data.projectName,
                projectLocation: data.projectLocation,
                bidDate: data.bidDate,
                labourCost: data.labourCost,
                totalEstimatedCost: data.totalEstimatedCost,
                startDate: data.startDate,
                completionDate: data.completionDate
            }
            await applyWorkOrdersServices.addApplyWorkOrder(postData);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", "WorkOrder apply add successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Apply WorkOrder failed",
                data: error.response?.data || {}
            });
        }
    },
    /*getAllApplyWorkOrder*/
    async getAllApplyWorkOrder(req, res) {
        try {
            let { page, length, workOrderId, projectId, status, startDate, endDate, contractorId, price } = req.query;
            let workOrderIds;
            if (page <= 0 || length <= 0) {
                throw new Error("Page and length must be greater than 0");
            }
            if(projectId){
                let getProjectById = await projectServices.getProjectById(projectId);
                if (!getProjectById) throw new Error("Project not found");
                let getWorkOrderById = await applyWorkOrdersServices.getWorkOrderById(projectId);
                 workOrderIds = getWorkOrderById.map(items =>{
                    return items.id;
                })
            }
            let applyOrders = await applyWorkOrdersServices.getAllApplyWorkOrder(page, length, workOrderId, status, workOrderIds, startDate, endDate, contractorId, price);
            applyOrders.forEach(element => {
                if (element.image) {
                    element.image = process.env.BASE_URL + element.image;
                }
            });
            let totalApplyOrders = await applyWorkOrdersServices.getTotalApplyWorkOrder(workOrderId, status, workOrderIds, startDate, endDate, contractorId, price);
            let response = {
                applyWorkOrders: applyOrders,
                totalRecords: totalApplyOrders.length
            }
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(response, "Apply WorkOrders displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Fetching apply workOrders failed",
                data: error.response?.data || {}
            });
        }
    },
    /*getApplyWorkOrderById*/
    async getApplyWorkOrderById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let applyWorkOrderId = req.query.applyWorkOrderId;
            let applyWorkOrder = await applyWorkOrdersServices.getApplyWorkOrderById(applyWorkOrderId);
            if (!applyWorkOrder) throw new Error("Apply workOrder not found");
            if (applyWorkOrder.image != null) {
                applyWorkOrder.image = process.env.BASE_URL + applyWorkOrder.image;
            }

            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(applyWorkOrder, "Apply WorkOrders displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Fetching Apply WorkOrders failed",
                data: error.response?.data || {}
            });
        }
    },
    /*updateApplyWorkOrderById*/
    async updateApplyWorkOrderById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let applyWorkOrderId = req.query.applyWorkOrderId;
            let applyWorkOrder = await applyWorkOrdersServices.getApplyWorkOrderById(applyWorkOrderId);
            if (!applyWorkOrder) throw new Error("Apply workOrder not found");
            const baseUrl = "/public/files/";
            let image = req.file ? `${baseUrl}${req.file.filename}` : null;
            let data = req.body;
            let postData = {
                description: data.description,
                // image: image,
                projectName: data.projectName,
                projectLocation: data.projectLocation,
                bidDate: data.bidDate,
                labourCost: data.labourCost,
                totalEstimatedCost: data.totalEstimatedCost,
                startDate: data.startDate,
                completionDate: data.completionDate
            }
            commonHelper.removeFalsyKeys(postData);
            let updateApplyWorkOrderById = await applyWorkOrdersServices.updateApplyWorkOrderById(postData, applyWorkOrderId);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(updateApplyWorkOrderById, "Apply WorkOrders updated successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Updating Apply WorkOrders failed",
                data: error.response?.data || {}
            });
        }
    },
    /*deleteApplyWorkOrderById*/
    async deleteApplyWorkOrderById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let applyWorkOrderId = req.query.applyWorkOrderId;
            let applyWorkOrder = await applyWorkOrdersServices.getApplyWorkOrderById(applyWorkOrderId);
            if (!applyWorkOrder) throw new Error("Apply workOrder not found");
            let deleteApplyWorkOrder = await applyWorkOrdersServices.deleteApplyWorkOrderById(applyWorkOrderId);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(deleteApplyWorkOrder, "Apply WorkOrders deleted successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Deleting Apply WorkOrders failed",
                data: error.response?.data || {}
            });
        }

    },
    /*getContractorProposal*/
    async getContractorProposal(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            if (!req.query.workOrderId) throw new Error("Work order id is required found");
            if (!req.query.contractorId) throw new Error("Contractor id is required found");
            let workOrderId = req.query.workOrderId;
            let contractorId = req.query.contractorId;


            let getContractorProposal = await applyWorkOrdersServices.getContractorProposal(workOrderId, contractorId);
            if (!getContractorProposal) throw new Error("Proposal not found");
            if (getContractorProposal.image != null) {
                applyWorkOrder.image = process.env.BASE_URL + applyWorkOrder.image;
            }

            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(getContractorProposal, "Proposal displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Fetching Proposal failed",
                data: error.response?.data || {}
            });
        }
    },
    /*acceptRejectProposal*/
    async acceptRejectProposal(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let workOrderId = req.query.workOrderId;
            let contractorId = req.query.contractorId;

            let status = req.body.status;
            if (status !== "accept" && status !== "reject") throw new Error("Only send accept or reject in status");

            let getContractorProposal = await applyWorkOrdersServices.getContractorProposal(workOrderId, contractorId);
            if (!getContractorProposal) throw new Error("Proposal not found");
            if (getContractorProposal.image != null) applyWorkOrder.image = process.env.BASE_URL + applyWorkOrder.image;
            let postData = {
                status: status
            }
            let acceptRejectProposal = await applyWorkOrdersServices.acceptRejectProposal(workOrderId, contractorId, postData);
            if(status == "accept"){
            let data = {
                bidStatus: "accept"
            }
            await applyWorkOrdersServices.acceptRejectBidStatus(workOrderId, data);
        }

            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(acceptRejectProposal, "Proposal updated successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Updating Proposal failed",
                data: error.response?.data || {}
            });
        }
    },
    /*bidsOnWorkOrder*/
    async bidsOnWorkOrder(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let workOrderId = req.query.workOrderId;
            let bidsOnWorkOrder = await applyWorkOrdersServices.bidsOnWorkOrder(workOrderId);
            if (bidsOnWorkOrder.image != null) {
                bidsOnWorkOrder.image = process.env.BASE_URL + bidsOnWorkOrder.image;
            }

            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(bidsOnWorkOrder, "Bids on workOrder displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Fetching Apply WorkOrders failed",
                data: error.response?.data || {}
            });
        }
    },

    validate(method) {
        switch (method) {
            case "addApplyWorkOrder": {
                return [
                    check("workOrderId").not().isEmpty().withMessage("Work Order Id is Required"),
                    check("contractorId").not().isEmpty().withMessage("Contractor Id is Required"),
                    check("description").not().isEmpty().withMessage("Description Id is Required"),
                    check("projectName").not().isEmpty().withMessage("Project Name is Required"),
                    check("projectLocation").not().isEmpty().withMessage("Project Location is Required"),
                    check("bidDate").not().isEmpty().withMessage("Bid Date is Required"),
                    check("labourCost").not().isEmpty().withMessage("Labour Cost is Required"),
                    check("totalEstimatedCost").not().isEmpty().withMessage("Total Estimated Cost is Required"),
                    check("startDate").not().isEmpty().withMessage("Start Date is Required")
                ];
            }
            case "getApplyWorkOrderById": {
                return [
                    check("applyWorkOrderId").not().isEmpty().withMessage("Apply Work Order Id is Required"),
                ];
            }
            case "getContractorProposal": {
                return [
                    check("workOrderId").not().isEmpty().withMessage("Work Order Id is Required"),
                    check("contractorId").not().isEmpty().withMessage("contractor Id is Required"),
                ];
            }
            case "bidsOnWorkOrder": {
                return [
                    check("workOrderId").not().isEmpty().withMessage("Work Order Id is Required")
                ];
            }
        }
    }
};
