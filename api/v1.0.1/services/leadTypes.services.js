var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op } = require("sequelize");

module.exports = {
    /*addleadStatuses*/
    async addleadType(postData) {
        try {
            let leadTypes = await db.leadTypesObj.create(postData);
            return leadTypes;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    async getAllleadTypes({ page, per_page, search }) {
        try {
            const offset = (page - 1) * per_page;

            const whereCondition = {};

            if (search) {
                whereCondition[Op.or] = [
                    { title: { [Op.iLike]: `%${search}%` } },
                    { color: { [Op.iLike]: `%${search}%` } },
                ];
            }

            const { rows, count } = await db.leadTypesObj.findAndCountAll({
                where: whereCondition,
                order: [["id", "DESC"]],
                limit:per_page,
                offset,
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
    async getleadTypesById(id) {
        try {
            const leadType = await db.leadTypesObj.findOne({
                where: { id },
            });

            if (!leadType) {
                throw new Error("Lead Type not found");
            }

            return leadType;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    async deleteleadTypes(id) {
        try {
            const leadType = await db.leadTypesObj.findOne({ where: { id } });
            if (!leadType) {
                throw new Error("Lead Type not found");
            }

            // Soft delete
            await leadType.destroy();

            return true;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /* Update Lead Status by ID */
    async updateleadTypes(id, postData) {
        try {

            const leadType = await db.leadTypesObj.findOne({ where: { id: parseInt(id) } });
            if (!leadType) throw new Error("Lead Status not found");

            const updated = await leadType.update(postData);
            return updated;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    }
}
