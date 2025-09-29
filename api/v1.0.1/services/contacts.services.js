var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op } = require("sequelize");

module.exports = {
    /*addContacts*/
    async addContacts(postData) {
        try {
            let contacts = await db.contactsObj.create(postData);
            return contacts;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    async getAllContacts({ page, limit, search }) {
        try {
            const offset = (page - 1) * limit;

            const whereCondition = {};

            if (search) {
                whereCondition[Op.or] = [
                    { title: { [Op.iLike]: `%${search}%` } },
                    { color: { [Op.iLike]: `%${search}%` } },
                ];
            }

            const { rows, count } = await db.contactsObj.findAndCountAll({
                where: whereCondition,
                order: [["id", "DESC"]],
                include:[
                    { model: db.companyObj, as: "company" }
                ],
                limit,
                offset,
            });

            return {
                data: rows,
                meta: {
                    current_page: page,
                    from: offset + 1,
                    to: offset + rows.length,
                    per_page: limit,
                    total: count,
                    last_page: Math.ceil(count / limit)
                }
            };
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    async getContactsById(id) {
        try {
            const contacts = await db.contactsObj.findOne({
                where: { id },
                include:[
                    { model: db.companyObj, as: "company" }
                ]
            });

            if (!contacts) {
                throw new Error("Lead Status not found");
            }

            return contacts;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    async deleteContacts(id) {
        try {
            const contacts = await db.contactsObj.findOne({ where: { id } });
            if (!contacts) {
                throw new Error("contacts Status not found");
            }

            // Soft delete
            await contacts.destroy();

            return true;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /* Update Lead Status by ID */
    async updateContacts(id, postData) {
        try {

            const contacts = await db.contactsObj.findOne({ where: { id: parseInt(id) } });
            if (!contacts) throw new Error("contacts Status not found");

            const updated = await contacts.update(postData);
            return updated;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    }
}
