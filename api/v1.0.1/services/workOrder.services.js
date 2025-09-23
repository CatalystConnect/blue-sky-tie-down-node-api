var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op, Sequelize } = require("sequelize");



module.exports = {
    /*addOrder*/
    async addOrder(postData) {
        try {
            let order = await db.workOrderObj.create(postData);
            return order;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getAllOrder*/
    async getAllOrder(page, length) {
        try {
            limit = length || 10;
            offset = (page - 1) * limit || 0;
            let orders = await db.workOrderObj.findAll(
                {
                    where: {bidStatus: null},
                    offset,
                    limit,
                    order: [["id", "DESC"]],
                    include: [
                        {
                            model: db.contractRegionObj,
                            as: "regions",
                            attributes: { exclude: ["associateZipCode", "createdAt", "updatedAt"] },
                            required: false
                        },
                    ],
                    include: [
                        {
                            model: db.applyWorkOrderObj,
                            as: "biders",
                            attributes: ["contractorId", "totalEstimatedCost"],
                            required: false,
                            include: [
                                {
                                    model: db.userObj,
                                    as: "contractorInfo",
                                    attributes: ["firstName"],
                                    required: false
                                },
                            ]
                        },
                    ]
                }
            );
            return orders;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getOrderById*/
    async getOrderById(workOrderId) {
        try {
            let order = await db.workOrderObj.findOne({
                where: { id: workOrderId, bidStatus: null },
                include: [
                    {
                        model: db.workOrderImagesObj,
                        as: "images",
                        attributes: { exclude: ["workOrderId", "createdAt", "updatedAt"] },
                        required: false
                    },
                    {
                        model: db.applyWorkOrderObj,
                        as: "biders",
                        attributes: ["contractorId", "totalEstimatedCost"],
                        required: false,
                        include: [
                            {
                                model: db.userObj,
                                as: "contractorInfo",
                                attributes: ["firstName"],
                                required: false
                            },
                        ]
                    },
                ]
            });
            return order;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*updateOrder*/
    async updateWorkOrder(data, orderId) {
        try {
            let order = await db.workOrderObj.update(data, {
                where: { id: orderId }
            });
            return order;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*deleteOrder*/
    async deleteOrder(orderId) {
        try {
            let order = await db.workOrderObj.destroy({
                where: { id: orderId }
            });
            return order;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*uploadFiles*/
    async uploadFiles(files) {
        try {
            let data = await db.workOrderImagesObj.bulkCreate(files);
            return data;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getImageById*/
    async getImageById(imageId) {
        try {
            let image = await db.workOrderImagesObj.findOne({
                where: { id: imageId },
                raw: true
            });
            return image;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*deleteImage*/
    async deleteImage(imageId) {
        try {
            let image = await db.workOrderImagesObj.destroy({
                where: { id: imageId }
            });
            return image;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getAllImages*/
    async getAllImages(workOrderId) {
        try {
            let image = await db.workOrderImagesObj.findAll({
                where: { workOrderId: workOrderId }
            });
            return image;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getAllOrder*/
    async totalWorkOrder() {
        try {
            let orders = await db.workOrderObj.findAll()
            return orders;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*addWorkCategory*/
    async addWorkCategory(data) {
        try {
            let category = await db.workOrderCategoriesObj.create(data)
            return category;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getAllCategories*/
    async getAllCategories() {
        try {
            let category = await db.workOrderCategoriesObj.findAll({
                attributes: { exclude: ["createdAt", "updatedAt"] },
            })
            return category;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getWorkCategoryById*/
    async getWorkCategoryById(categoryId) {
        try {
            let category = await db.workOrderCategoriesObj.findOne({
                where: { id: categoryId },
                attributes: { exclude: ["createdAt", "updatedAt"] },
            })
            return category;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*updateCategory*/
    async updateCategory(data, categoryId) {
        try {
            let category = await db.workOrderCategoriesObj.update(data, {
                where: { id: categoryId }
            })
            return category;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*deleteCategory*/
    async deleteCategory(categoryId) {
        try {
            let category = await db.workOrderCategoriesObj.destroy({
                where: { id: categoryId }
            })
            return category;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*deleteApplyOrder*/
    async deleteApplyOrder(orderId) {
        try {
            let order = await db.applyWorkOrderObj.destroy({
                where: { workOrderId: orderId }
            });
            return order;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
};
