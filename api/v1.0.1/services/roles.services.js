var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Sequelize, Op } = require("sequelize");

module.exports = {
    /*addRole*/
    async addRole(postData) {
        try {
            let role = await db.rolesObj.create(postData);
            return role;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getRoleByName*/
    async getRoleByName(name) {
        try {
            let role = await db.rolesObj.findOne({
                where: { name: name },
                raw: true
            });
            return role;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },

    // async getAllRoles(page = 1, perPage = 10, search = "", id = null) {
    //     try {
    //         // Defensive parsing
    //         page = Number.isNaN(parseInt(page)) ? 1 : parseInt(page);
    //         perPage = Number.isNaN(parseInt(perPage)) ? 10 : parseInt(perPage);

    //         const offset = (page - 1) * perPage;

    //         // Build where condition
    //         const whereCondition = {};

    //         if (search) {
    //             const searchLower = search.toLowerCase();
    //             whereCondition[Op.or] = [
    //                 Sequelize.where(
    //                     Sequelize.fn("LOWER", Sequelize.col("roles.name")),
    //                     { [Op.like]: `%${searchLower}%` }
    //                 )
    //             ];
    //         }

    //         // Default order
    //         let orderCondition = [["id", "ASC"]];

    //         // If id is provided, adjust ordering so that id row comes first
    //         if (id) {
    //             const idInt = parseInt(id);
    //             if (!Number.isNaN(idInt)) {
    //                 orderCondition = [
    //                     [
    //                         db.Sequelize.literal(`CASE WHEN roles.id = ${idInt} THEN 0 ELSE 1 END`),
    //                         "ASC"
    //                     ],
    //                     ["id", "ASC"]
    //                 ];
    //             }
    //         }

    //         // Query
    //         const { count, rows } = await db.rolesObj.findAndCountAll({
    //             where: whereCondition,
    //             offset,
    //             limit: perPage,
    //             order: orderCondition,
    //             raw: true
    //         });

    //         return {
    //             data: rows,
    //             meta: {
    //                 current_page: page,
    //                 from: offset + 1,
    //                 to: offset + rows.length,
    //                 per_page: perPage,
    //                 total: count,
    //                 last_page: Math.ceil(count / perPage)
    //             }
    //         };
    //     } catch (e) {
    //         logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
    //         throw e;
    //     }
    // },
    async getAllRoles(page = 1, perPage = 10, search = "", id = null) {
        try {
            // Defensive parsing (same)
            page = Number.isNaN(parseInt(page)) ? 1 : parseInt(page);
            perPage = Number.isNaN(parseInt(perPage)) ? 10 : parseInt(perPage);

            const offset = (page - 1) * perPage;

            // Build where condition (same)
            const whereCondition = {};

            if (search) {
                const searchLower = search.toLowerCase();
                whereCondition[Op.or] = [
                    Sequelize.where(
                        Sequelize.fn("LOWER", Sequelize.col("roles.name")),
                        { [Op.like]: `%${searchLower}%` }
                    )
                ];
            }

            // Order condition (same)
            let orderCondition = [["id", "ASC"]];

            if (id) {
                const idInt = parseInt(id);
                if (!Number.isNaN(idInt)) {
                    orderCondition = [
                        [
                            db.Sequelize.literal(
                                `CASE WHEN roles.id = ${idInt} THEN 0 ELSE 1 END`
                            ),
                            "ASC"
                        ],
                        ["id", "ASC"]
                    ];
                }
            }

            // Query (same)
            const { count, rows } = await db.rolesObj.findAndCountAll({
                where: whereCondition,
                offset,
                limit: perPage,
                order: orderCondition,
                raw: true
            });

            // ---------- LAZY LOAD META (NEW) ----------
            const total = count;
            const current_count = rows.length;
            const loaded_till_now = offset + current_count;
            const remaining = Math.max(total - loaded_till_now, 0);
            const has_more = loaded_till_now < total;

            return {
                data: rows,
                meta: {
                    page,
                    limit: perPage,
                    current_count,
                    loaded_till_now,
                    remaining,
                    total,
                    has_more
                }
            };
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },

    /*getRoleById*/
    async getRoleById(roleId) {
        try {
            let roles = await db.rolesObj.findOne({
                where: { id: roleId }
            });
            return roles;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*updateRole*/
    async updateRole(data, roleId) {
        try {
            let roles = await db.rolesObj.update(data, {
                where: { id: roleId }
            });
            return roles;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*deleteRole*/
    async deleteRole(roleId) {
        try {
            let deleteRole = await db.rolesObj.destroy({
                where: { id: roleId }
            });
            return deleteRole;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    }
}