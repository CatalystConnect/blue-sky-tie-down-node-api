require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const workOrderServices = require("../services/workOrder.services");
const contractServices = require("../services/contract.services");
const leadServices = require("../services/lead.services");
const activityServices = require("../services/activities.services");
const notesServices = require("../services/notes.services");
const projectServices = require("../services/project.services");
const { check, validationResult } = require("express-validator"); // Updated import
const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return error.msg;
    },
});

module.exports = {
    /*addWorkOrder*/
    async addWorkOrder(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            if (!req.files || req.files.length === 0) {
                throw new Error("No files uploaded")
            }
            let data = req.body;
            if(data?.projectId){
                let getProjectById = await projectServices.getProjectById(data.projectId);
                if (!getProjectById) throw new Error("Project not found");
            }
            let postData = {
                workOrder: data.workOrder,
                projectId: data.projectId,
                workingCategory: data.workingCategory,
                startDate: data.startDate,
                finishDate: data.finishDate,
                startingPrice: data.startingPrice,
                description: data.description,
                location: data.location,
                longitude: data.longitude,
                latitude: data.latitude,
                offerBox: data.offerBox,
                price: data.price,
                region: data.region,
                leadAddress: data.leadAddress,
                address: data.address,
                state: data.state,
                city: data.city,
                zip: data.zip,
                status: data.status
            }
            let order = await workOrderServices.addOrder(postData);
            postData = {
                title: `#WO-${order.id}(${order.address})`
            }
            let orderId = order.id;
            await workOrderServices.updateWorkOrder(postData, orderId);
            const baseUrl = "/public/files/";
            let files = req.files.map(file => ({
                workOrderId: orderId,
                image: `${baseUrl}${file.filename}`
            }));
            await workOrderServices.uploadFiles(files);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", " Work Order added successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Work Order added failed",
                data: error.response?.data || {}
            });
        }
    },
     /*getAllWorkOrder*/
     async getAllWorkOrder(req, res) {
        try {
            let { page, length } = req.query;
            if (page <= 0 || length <= 0) {
                throw new Error("Page and length must be greater than 0");
            }
            let workOrders = await workOrderServices.getAllOrder(page, length);
            if (!workOrders) {
                throw new Error("Work orders not found");
            }
            workOrders.forEach(element => {
                if (element.startDate) {
                    element.startDate = commonHelper.formatToCustomDate(element?.startDate);
                }
                if (element.finishDate) {
                    element.finishDate = commonHelper.formatToCustomDate(element?.finishDate);
                }
            });
            let totalRecords = await workOrderServices.totalWorkOrder();
            let response = {
                workOrders: workOrders,
                totalRecords: totalRecords.length
            }
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(response, "Work Order displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Work Order fetching failed",
                data: error.response?.data || {}
            });
        }
    },
     /*getWorkOrderById*/
     async getWorkOrderById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let workOrderId = req.query.workOrderId;
            let workOrders = await workOrderServices.getOrderById(workOrderId);
            if (!workOrders) throw new Error("Work order not found");
            if (workOrders.startDate) {
                workOrders.startDate = commonHelper.formatToCustomDate(workOrders?.startDate);
            }
            if (workOrders.finishDate) {
                workOrders.finishDate = commonHelper.formatToCustomDate(workOrders?.finishDate);
            }
            if (workOrders.images) {
                workOrders.images.forEach(image => {
                    image.image = process.env.BASE_URL+image.image
                })
            }  
            if(workOrders.workingCategory){
                let sanitizedCategory = workOrders.workingCategory.replace(/^'|'$/g, '');
                workOrders.workingCategory =  JSON.parse(sanitizedCategory)
            }
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(workOrders, "Work order displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Work order fetching failed",
                data: error.response?.data || {}
            });
        }
    },
    /*updateWorkOrder*/
    async updateWorkOrder(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let workOrderId = req.query.workOrderId;
            let workOrder = await workOrderServices.getOrderById(workOrderId);
            if (!workOrder) throw new Error("Work order not found");
            let data = req.body;
            let postData = {
                title: data.title,
                workOrder: data.workOrder,
                workingCategory: data.workingCategory,
                startDate: data.startDate,
                finishDate: data.finishDate,
                startingPrice: data.startingPrice,
                description: data.description,
                location: data.location,
                longitude: data.longitude,
                latitude: data.latitude,
                offerBox: data.offerBox,
                price: data.price,
                region: data.region,
                leadAddress: data.leadAddress,
                address: data.address,
                state: data.state,
                city: data.city,
                zip: data.zip,
                status: data.status
                // publishTo: data.publishTo,
                // inviteContractor: data.inviteContractor

            }
            commonHelper.removeFalsyKeys(postData);

            if(req.files){
                const baseUrl = "https://crm-roofing-973d4725fb82.herokuapp.com/public/files/";
                let files = req.files.map(file => ({
                    workOrderId: workOrderId,
                    image: `${baseUrl}${file.filename}`
                }));
            await workOrderServices.uploadFiles(files);
        }



        let moduleName = "workOrderObj"
            let id = workOrderId;
            postData = { ...postData, moduleName, id }
            let changes = await commonHelper.compareChanges(postData);
            if (changes.length != 0) {
                let newData = await commonHelper.transformChanges(changes, req.userId, workOrderId, moduleName)
                await leadServices.createActivity(newData);
            }

            let updateWorkOrder = await workOrderServices.updateWorkOrder(postData, workOrderId);
            
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(updateWorkOrder, "Work order update successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Work order updating failed",
                data: error.response?.data || {}
            });
        }
    },
    /*deleteWorkOrder*/
    async deleteWorkOrder(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let orderId = req.query.workOrderId;
            let order = await workOrderServices.getOrderById(orderId);
            if (!order) throw new Error("Work orders not found");
            let deleteOrder = await workOrderServices.deleteOrder(orderId);
            await workOrderServices.deleteApplyOrder(orderId);

            let data = {
                isdeleted: "deleted"
            }
            let module = "workOrder";
            await notesServices.updateNotes(data, orderId, module);
            await activityServices.updateActivity(data, orderId, module);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(deleteOrder, "Order deleted successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Order deleting failed",
                data: error.response?.data || {}
            });
        }
    },
    /*deleteOrder*/
    async deleteImage(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let imageId = req.query.imageId;
            let image = await workOrderServices.getImageById(imageId);
            if (!image) throw new Error("Image not found");
            let deleteImage = await workOrderServices.deleteImage(imageId);
            let workOrderId = image.workOrderId;
            let getAllImages = await workOrderServices.getAllImages(workOrderId);
                return res
                .status(200)
                .send(commonHelper.parseSuccessRespose({deleteImage,getAllImages}, "Image deleted successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Image deleting failed",
                data: error.response?.data || {}
            });
        }
    },
    /*addWorkCategory*/
    async addWorkCategory(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let data = req.body;
            let postData = {
                category: data.category
            }
            await workOrderServices.addWorkCategory(postData);
                return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", "WorkOrder category added successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Image deleting failed",
                data: error.response?.data || {}
            });
        }
    },
    /*getAllWorkCategory*/
    async getAllWorkCategory(req, res) {
        try {
            let categories = await workOrderServices.getAllCategories();
           if (!categories) throw new Error("Category not found");
                return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(categories, "WorkOrder category displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Fetching categories failed",
                data: error.response?.data || {}
            });
        }
    },
     /*getWorkCategoryById*/
     async getWorkCategoryById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let categoryId = req.query.categoryId;
            let category = await workOrderServices.getWorkCategoryById(categoryId);
            if (!category) throw new Error("Category not found");
                return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(category, "WorkOrder category displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Fetching categories failed",
                data: error.response?.data || {}
            });
        }
    },
    /*updateWorkCategory*/
    async updateWorkCategory(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let categoryId = req.query.categoryId;
            let  category = req.body.category;
            let postData = {
                category: category
            }
            let categoryById = await workOrderServices.getWorkCategoryById(categoryId);
            if (!categoryById) throw new Error("Category not found");
            let updateCategory = await workOrderServices.updateCategory(postData, categoryId);
                return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(updateCategory, "WorkOrder category updated successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Updating categories failed",
                data: error.response?.data || {}
            });
        }
    },
    /*deleteWorkCategory*/
    async deleteWorkCategory(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let categoryId = req.query.categoryId;
            let categoryById = await workOrderServices.getWorkCategoryById(categoryId);
            if (!categoryById) throw new Error("Category not found");
            let deleteCategory = await workOrderServices.deleteCategory(categoryId);
                return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(deleteCategory, "WorkOrder category updated successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Updating categories failed",
                data: error.response?.data || {}
            });
        }
    },
     /*getRegionByZipCode*/
     async getRegionByZipCode(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let zipCode = req.query.zipCode;
            let getRegionByZipCode = await contractServices.getRegionByZipCode(zipCode);
            if (getRegionByZipCode.length == 0) throw new Error("Region not found");
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(getRegionByZipCode[0], "ContractRegion Dispalyed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "FEtching contractRegion failed",
                data: error.response?.data || {}
            });
        }
    },
    
    validate(method) {
        switch (method) {
            case "addWorkOrder": {
                return [
                    check("workOrder").not().isEmpty().withMessage("Work Order is Required"),
                    check("workingCategory").not().isEmpty().withMessage("Working Category is Required"),
                    check("startDate").not().isEmpty().withMessage("State Date is Required"),
                    check("startingPrice").not().isEmpty().withMessage("Starting Price is Required"),
                    check("price").not().isEmpty().withMessage("Price is Required"),
                    check("projectId").not().isEmpty().withMessage("Project Id is Required")
                ]
            }
            case "getOrderById": {
                return [
                    check("workOrderId").not().isEmpty().withMessage("Work Order Id is Required")
                ]
            }
            case "deleteImage": {
                return [
                    check("imageId").not().isEmpty().withMessage("Image Id is Required")
                ]
            }
            case "addWorkCategory": {
                return [
                    check("category").not().isEmpty().withMessage("Category is Required")
                ]
            }
            case "getWorkCategoryById": {
                return [
                    check("categoryId").not().isEmpty().withMessage("Category Id is Required")
                ]
            }
            case "getRegionByZipCode": {
                return [
                    check("zipCode").not().isEmpty().withMessage("ZipCode Id is Required")
                ]
            }
        }
    }
}