var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op } = require("sequelize");

module.exports = {
    /*addinteractionTypes*/
    async addinteractionTypes(postData) {
        try {
            let interactionTypes = await db.interactionTypesObj.create(postData);
            return interactionTypes;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    async getAllInteractionTypes({ page, per_page, search }) {
        try {
            const offset = (page - 1) * per_page;

            const whereCondition = {};

            if (search) {
                whereCondition[Op.or] = [
                    { title: { [Op.iLike]: `%${search}%` } },
                    { color: { [Op.iLike]: `%${search}%` } },
                ];
            }

            const { rows, count } = await db.interactionTypesObj.findAndCountAll({
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
    async getInteractionTypeById(id) {
        try {
            const interactionType = await db.interactionTypesObj.findOne({
                where: { id },
            });

            if (!interactionType) {
                throw new Error("Interaction Type not found");
            }

            return interactionType;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    async deleteInteractionType(id) {
        try {
            const interactionType = await db.interactionTypesObj.findOne({ where: { id } });
            if (!interactionType) {
                throw new Error("Interaction Type not found");
            }

            // Soft delete
            await interactionType.destroy();

            return true;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /* Update Interaction Type by ID */
    async updateInteractionType(id, postData) {
        try {

            const interactionType = await db.interactionTypesObj.findOne({ where: { id: parseInt(id) } });
            if (!interactionType) throw new Error("Interaction Type not found");

            const updated = await interactionType.update(postData);
            return updated;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    }
}
