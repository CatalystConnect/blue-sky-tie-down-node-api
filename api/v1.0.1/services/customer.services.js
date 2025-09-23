var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");

module.exports = {
    /*customerAdd*/
    async customerAdd(postData) {
        try {
            let customer = await db.customerObj.create(postData);
            return customer;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getCustomerByEmail*/
    async getCustomerByEmail(email) {
        try {
            let customer = await db.customerObj.findOne({
                where: { email: email },
                raw: true
            });
            return customer;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getAllCustomer*/
    async getAllCustomer(page, length) {
        try {
            limit = length || 10;
            offset = (page - 1) * limit || 0;
            let customer = await db.customerObj.findAll({
                limit,
                offset,
                order: [["id", "DESC"]],
            }
            );
            return customer;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*totalCustomers*/
    async totalCustomers() {
        try {
            let customer = await db.customerObj.findAll();
            return customer;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getCustomerById*/
    async getCustomerById(customerId) {
        try {
            let customer = await db.customerObj.findAll({
                where: { id: customerId },
            });
            if (customer.length === 0) {
                customer = null;
            }
            return customer;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*updateCustomer*/
    async updateCustomer(data, customerId) {
        try {
            let updateUser = await db.customerObj.update(data, {
                where: { id: customerId }
            });
            return updateUser;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*deleteCustomer*/
    async deleteCustomer(customerId) {
        try {
            let customer = await db.customerObj.destroy({
                where: { id: customerId },
            });
            return customer;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    }
};
