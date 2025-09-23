var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op } = require("sequelize");

module.exports = {
    /*addleadStatuses*/
    async addleadStatuses(postData) {
        try {
            let leadStatuses = await db.leadStatusesObj.create(postData);
            return leadStatuses;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    async getAllleadStatuses({ page, limit, search }) {
        try {
            const offset = (page - 1) * limit;

            const whereCondition = {};

            if (search) {
                whereCondition[Op.or] = [
                    { title: { [Op.iLike]: `%${search}%` } },
                    { color: { [Op.iLike]: `%${search}%` } },
                ];
            }

            const { rows, count } = await db.leadStatusesObj.findAndCountAll({
                where: whereCondition,
                order: [["id", "ASC"]],
                limit,
                offset,
            });

            return {
                total: count,
                page,
                limit,
                data: rows,
            };
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    async getleadStatusesById(id) {
        try {
            const leadStatus = await db.leadStatusesObj.findOne({
                where: { id },
            });

            if (!leadStatus) {
                throw new Error("Lead Status not found");
            }

            return leadStatus;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    async deleteleadStatuses(id) {
        try {
            const leadStatus = await db.leadStatusesObj.findOne({ where: { id } });
            if (!leadStatus) {
                throw new Error("Lead Status not found");
            }

            // Soft delete
            await leadStatus.destroy();

            return true;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /* Update Lead Status by ID */
    async updateleadStatuses(id, postData) {
        try { 
            
            const leadStatus = await db.leadStatusesObj.findOne({ where: { id: parseInt(id) } });
            if (!leadStatus) throw new Error("Lead Status not found");

            const updated = await leadStatus.update(postData);
            return updated;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    }
}
