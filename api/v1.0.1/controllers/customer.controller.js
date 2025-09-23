require("dotenv").config();
var commonHelper = require("../helper/common.helper");
var bcrypt = require("bcryptjs");
const customerServices = require("../services/customer.services");
const { check, validationResult } = require("express-validator"); // Updated import
const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return error.msg;
    },
});

module.exports = {
    /*customerAdd*/
    async customerAdd(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let data = req.body;
            const getCustomerInfo = await customerServices.getCustomerByEmail(data.email);
            if (getCustomerInfo) throw new Error("Customer already exist");
            let postData = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                customerLocation: data.customerLocation,
                address: data.address,
                state: data.address,
                city: data.city,
                zip: data.zip
            }
            await customerServices.customerAdd(postData);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", "Customer register successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Add Customer failed",
                data: error.response?.data || {}
            });
        }

    },
    /*getAllCustomer*/
    async getAllCustomer(req, res) {
        try {
            let { page, length } = req.query;
            if (page <= 0 || length <= 0) {
                throw new Error("Page and length must be greater than 0");
            }
            const customers = await customerServices.getAllCustomer(page, length);
            if (!customers || customers.length == 0) throw new Error("Customers not found");
            const totalCustomers = await customerServices.totalCustomers();
            let response = {
                customers: customers,
                totalCustomers: totalCustomers.length
            }

            return res
                .status(200)
                .send(
                    commonHelper.parseSuccessRespose(
                        response,
                        "Customers displayed successfully"
                    )
                );
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Customers fetch failed",
                data: error.response?.data || {}
            });
        }
    },
    /*getCustomerById*/
    async getCustomerById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let customerId = req.query.customerId;
            const customer = await customerServices.getCustomerById(customerId);
            if (!customer) throw new Error("Customer not found");
            return res
                .status(200)
                .send(
                    commonHelper.parseSuccessRespose(
                        customer,
                        "Customer displayed successfully"
                    )
                );
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Customer fetch failed",
                data: error.response?.data || {}
            });
        }
    },
    /*updateCustomer*/
    async updateCustomer(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let customerId = req.query.customerId;
            const customer = await customerServices.getCustomerById(customerId);
            if (!customer) throw new Error("Customer not found");
            let data = req.body;

            let postData = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                customerLocation: data.customerLocation,
                address: data.address,
                state: data.address,
                city: data.city,
                zip: data.zip
            }
            commonHelper.removeFalsyKeys(postData);
            const updateCustomer = await customerServices.updateCustomer(postData, customerId);

            return res
                .status(200)
                .send(
                    commonHelper.parseSuccessRespose(
                        updateCustomer,
                        "Update Customer updated successfully"
                    )
                );
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Customer updated failed",
                data: error.response?.data || {}
            });
        }
    },
    /*deleteCustomer*/
    async deleteCustomer(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let customerId = req.query.customerId;
            const customer = await customerServices.getCustomerById(customerId);
            if (!customer) throw new Error("Customer not found");
            const deleteCustomer = await customerServices.deleteCustomer(customerId);
            return res
                .status(200)
                .send(
                    commonHelper.parseSuccessRespose(
                        deleteCustomer,
                        "Customer deleted successfully"
                    )
                );
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Customer Deleting failed",
                data: error.response?.data || {}
            });
        }

    },
    validate(method) {
        switch (method) {
            case "customerAdd": {
                return [
                    check("email").not().isEmpty().withMessage("Email is Required"),
                    check("firstName").not().isEmpty().withMessage("FirstName is Required"),
                    check("phone").not().isEmpty().withMessage("Phone is Required")
                ];
            }
            case "getCustomerById": {
                return [
                    check("customerId").not().isEmpty().withMessage("Customer Id is Required")
                ];
            }
        }
    }
};
