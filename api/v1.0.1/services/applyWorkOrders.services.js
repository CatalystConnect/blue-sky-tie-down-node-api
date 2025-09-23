var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op, literal } = require("sequelize");


module.exports = {
    /*addApplyWorkOrder*/
    async addApplyWorkOrder(postData) {
        try {
            let applyWorkOrder = await db.applyWorkOrderObj.create(postData);
            return applyWorkOrder;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*findContractor*/
    async findContractor(contractorId) {
        try {
            let applyWorkOrder = await db.userObj.create({
                where: {id: contractorId,role: "qualified_contractor"}
            });
            return applyWorkOrder;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getAllApplyWorkOrder*/
    async getAllApplyWorkOrder(page, length, workOrderId, status, workOrderIds, startDate, endDate, contractorId, price) {
        try {
            let whereCondition = {};
            if(workOrderId){
                whereCondition.workOrderId = workOrderId
            }
            if(status){
                whereCondition.status = status
            }
            if(workOrderIds){
                whereCondition.workOrderId = workOrderIds
            }
            if(contractorId){
                whereCondition.contractorId = contractorId
            }
            if (startDate && endDate) {
                const startUTC = new Date(Date.UTC(
                  new Date(startDate).getFullYear(),
                  new Date(startDate).getMonth(),
                  new Date(startDate).getDate()
                ));
              
                const endUTC = new Date(Date.UTC(
                  new Date(endDate).getFullYear(),
                  new Date(endDate).getMonth(),
                  new Date(endDate).getDate(),
                  23, 59, 59, 999
                ));
              
                whereCondition.startDate = {
                  [Op.between]: [startUTC, endUTC]
                };
              }
              if (price) {
                const priceRanges = price.split(",");
            
                const priceConditions = priceRanges.map(range => {
                    const [min, max] = range.split("-").map(Number);
                    return literal(`CAST("totalEstimatedCost" AS NUMERIC) BETWEEN ${min} AND ${max}`);
                });
            
                whereCondition[Op.or] = priceConditions;
            }
            
              
            limit = length || 10;
            offset = (page - 1) * limit || 0;
            let applyWorkOrder = await db.applyWorkOrderObj.findAll({
            where: { ...whereCondition },
            limit,
            offset,
            order: [["id", "DESC"]]
            });
            return applyWorkOrder;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getTotalApplyWorkOrder*/
    async getTotalApplyWorkOrder(workOrderId, status, workOrderIds, startDate, endDate, contractorId, price) {
        try {
            let whereCondition = {};
            if(workOrderId){
                whereCondition.workOrderId = workOrderId
            }
            if(status){
                whereCondition.status = status
            }
            if(workOrderIds){
                whereCondition.workOrderId = workOrderIds
            }
            if(contractorId){
                whereCondition.contractorId = contractorId
            }
            if (startDate && endDate) {
                const startUTC = new Date(Date.UTC(
                  new Date(startDate).getFullYear(),
                  new Date(startDate).getMonth(),
                  new Date(startDate).getDate()
                ));
              
                const endUTC = new Date(Date.UTC(
                  new Date(endDate).getFullYear(),
                  new Date(endDate).getMonth(),
                  new Date(endDate).getDate(),
                  23, 59, 59, 999
                ));
              
                whereCondition.startDate = {
                  [Op.between]: [startUTC, endUTC]
                };
              }
              if (price) {
                const priceRanges = price.split(",");
            
                const priceConditions = priceRanges.map(range => {
                    const [min, max] = range.split("-").map(Number);
                    return literal(`CAST("totalEstimatedCost" AS NUMERIC) BETWEEN ${min} AND ${max}`);
                });
            
                whereCondition[Op.or] = priceConditions;
            }
            let applyWorkOrder = await db.applyWorkOrderObj.findAll({
                where: { ...whereCondition }
            });
            return applyWorkOrder;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getApplyWorkOrderById*/
    async getApplyWorkOrderById(applyWorkOrderId) {
        try {
            let applyWorkOrder = await db.applyWorkOrderObj.findOne({
                where: {id: applyWorkOrderId},
                // raw: true,
                include: [
                    {
                        model: db.workOrderObj,
                        as: "workOrders",
                        required: false
                    },
                    {
                        model: db.userObj,
                        as: "contractor",
                        required: false
                    }
                ]
            });
            return applyWorkOrder;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*updateApplyWorkOrderById*/
    async updateApplyWorkOrderById(data, applyWorkOrderId) {
        try {
            let attribute = await db.applyWorkOrderObj.update(data, {
                where: {id: applyWorkOrderId}
            });
            return attribute;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
     /*deleteApplyWorkOrderById*/
     async deleteApplyWorkOrderById(applyWorkOrderId) {
        try {
            let attribute = await db.applyWorkOrderObj.destroy({
                where: {id: applyWorkOrderId}
            });
            return attribute;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
     /*alreadyApply*/
     async alreadyApply(workOrderId, contractorId) {
        try {
            let attribute = await db.applyWorkOrderObj.findOne({
                where: {workOrderId: workOrderId, contractorId: contractorId}
            });
            return attribute;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getContractorProposal*/
    async getContractorProposal(workOrderId, contractorId) {
        try {
            let applyWorkOrder = await db.applyWorkOrderObj.findOne({
                where: {workOrderId: workOrderId, contractorId: contractorId},
                raw: true
            });
            return applyWorkOrder;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*acceptRejectProposal*/
    async acceptRejectProposal(workOrderId, contractorId, postData) {
        try {
            let acceptRejectProposal = await db.applyWorkOrderObj.update(postData, {
                where: {workOrderId: workOrderId, contractorId: contractorId},
                raw: true
            });
            return acceptRejectProposal;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*acceptRejectBidStatus*/
    async acceptRejectBidStatus(workOrderId, postData) {
        try {
            let acceptRejectProposal = await db.workOrderObj.update(postData, {
                where: {id: workOrderId},
                raw: true
            });
            return acceptRejectProposal;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
     /*rejectedContractor*/
     async rejectedContractor(workOrderId, contractorId) {
        try {
            let attribute = await db.applyWorkOrderObj.findOne({
                where: {workOrderId: workOrderId, contractorId: contractorId, status: "reject"}
            });
            return attribute;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
      /*getWorkOrderById*/
      async getWorkOrderById(projectId) {
        try {
            let applyWorkOrder = await db.workOrderObj.findAll({
                where: {projectId: projectId},
                raw: true
            });
            return applyWorkOrder;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
     /*bidsOnWorkOrder*/
     async bidsOnWorkOrder(workOrderId) {
        try {
            let bidsOnWorkOrder = await db.applyWorkOrderObj.findAll({
                where: {workOrderId: workOrderId}
            });
            return bidsOnWorkOrder;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
}