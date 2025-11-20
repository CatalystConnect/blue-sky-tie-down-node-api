var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op, Sequelize } = require("sequelize");

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
    async getAllContacts({ page, per_page, search }) {
        try {
            const offset = (page - 1) * per_page;

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
                include: [
                    { model: db.companyObj, as: "company" }
                ],
                limit: per_page,
                offset: offset,
            });

            return {
                data: rows,
                meta: {
                    current_page: page,
                    from: offset + 1,
                    to: offset + rows.length,
                    per_page: per_page,
                    total: count,
                    last_page: Math.ceil(count / per_page)
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
                include: [
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
    },
    // async getContactCompany(company_id) {
    //     return await db.contactsObj.findAll({
    //         where: { company_id },
    //         include: [
    //             { model: db.companyObj, as: "company" }
    //         ]
    //     });
    // }
    // 
    async getContactCompany({ company_id, search, page, limit, id }) {

        page = Number.isNaN(parseInt(page)) ? 1 : parseInt(page);
        limit = Number.isNaN(parseInt(limit)) ? 10 : parseInt(limit);

        const offset = (page - 1) * limit;

        const whereCondition = { company_id };


        if (search) {
            const searchLower = search.toLowerCase();
            whereCondition[Op.or] = [
                Sequelize.where(
                    Sequelize.fn("LOWER", Sequelize.col("contacts.name")),
                    { [Op.like]: `%${searchLower}%` }
                ),

            ];
        }


        let orderClause = [["id", "DESC"]];
        if (id) {
            const idInt = parseInt(id);
            if (!Number.isNaN(idInt)) {
                orderClause = [
                    [
                        Sequelize.literal(
                            `CASE WHEN "contacts"."id" = ${idInt} THEN 0 ELSE 1 END`
                        ),
                        "ASC",
                    ],
                    ["id", "DESC"],
                ];
            }
        }


        const { rows, count } = await db.contactsObj.findAndCountAll({
            where: whereCondition,
            include: [{ model: db.companyObj, as: "company" }],
            order: orderClause,
            limit,
            offset,
        });


        return {
            data: rows,
            meta: {
                current_page: page,
                per_page: limit,
                total: count,
                last_page: Math.ceil(count / limit),
            },
        };
    }
}
