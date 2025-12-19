require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator");
const leadStatusesServices = require("../services/leadStatuses.services");
const contactsServices = require("../services/contacts.services");
const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return error.msg;
    },
});

module.exports = {
    /*addContacts*/
    async addContacts(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let data = req.body;

            let postData = {
                user_id: req.userId,
                company_id: data.company_id,
                name: data.name,
                email: data.email,
                phone: data.phone,
                address: data.address,
                city: data.city,
                zip: data.zip,
                state: data.state,
                notes: data.notes,

            }
          let contactId =  await contactsServices.addContacts(postData);

               res.status(200).json({
                success: true,
                message: "add Contacts  successfully",
                contactId: contactId.id

            });
            // return res
            //     .status(200)
            //     .send(commonHelper.parseSuccessRespose("", "add Contacts  successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "add Contacts failed",
                data: error.response?.data || {}
            });
        }

    },
    async getAllContacts(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }

            let { page = 1, per_page, search = "" } = req.query;
            page = parseInt(page);
            per_page = parseInt(per_page) || 10;

            const result = await contactsServices.getAllContacts({ page, per_page, search });

            return res
                .status(200)
                .send({
                    status: true,
                    message: "Contacts Statuses fetched successfully",
                    data: result.data,
                    meta: result.meta
                });
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Get Lead Statuses failed",
                data: error.response?.data || {}
            });
        }
    }
    ,
    /* Get getContactsById by ID */
    async getContactsById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }

            const { id } = req.query;
            if (!id) {
                return res.status(200).send(
                    commonHelper.parseErrorRespose({ id: "ID is required" })
                );
            }

            const result = await contactsServices.getContactsById(id);

            return res
                .status(200)
                .send(
                    commonHelper.parseSuccessRespose(result, "Contacts fetched successfully")
                );
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Get Contacts failed",
                data: error.response?.data || {}
            });
        }
    },
    /* Delete Contacts by ID */
    async deleteContacts(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }

            const { id } = req.query;
            if (!id) {
                return res.status(200).send(
                    commonHelper.parseErrorRespose({ id: "ID is required" })
                );
            }

            await contactsServices.deleteContacts(id);

            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", "delete Contacts deleted successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "delete Contacts failed",
                data: error.response?.data || {}
            });
        }
    },
    /* updateContacts */
    async updateContacts(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }

            const { id } = req.query;
            if (!id) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose({ id: "ID is required" }));
            }

            const data = req.body;

            const postData = {
                user_id: req.userId,         // coming from auth middleware
                company_id: data.company_id,
                name: data.name,
                email: data.email,
                phone: data.phone,
                address: data.address,
                city: data.city,
                zip: data.zip,
                state: data.state,
                notes: data.notes,
            };


            const result = await contactsServices.updateContacts(id, postData);

            return res
                .status(200)
                .send(
                    commonHelper.parseSuccessRespose(result, "update Contacts updated successfully")
                );
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Update Contacts failed",
                data: error.response?.data || {},
            });
        }
    },

    async getContactCompany(req, res) {
        try {
            const { id: company_id } = req.params;
            const { search = "", page = 1, limit = 10,id } = req.query;

            if (!company_id) {
                return res.status(200).send(
                    commonHelper.parseErrorRespose({ id: "Company ID is required" })
                );
            }

            const result = await contactsServices.getContactCompany({company_id,
                search,
                page: parseInt(page),
                limit: parseInt(limit),
            id});

            return res
                .status(200)
                .send(
                    commonHelper.parseSuccessRespose(result, "Contacts fetched successfully")
                );
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Get Contacts failed",
                data: error.response?.data || {}
            });
        }
    },

}
