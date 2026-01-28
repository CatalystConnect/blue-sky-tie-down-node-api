var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Sequelize, Op } = require("sequelize");

module.exports = {
    /*addProductTemplate*/
    async addProductTemplate(postData) {
        try {
            let addProductTemplate = await db.productTemplateObj.create(postData);
            return addProductTemplate;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    async getAllProductTemplate(filters) {
        const {
            page = 1,
            per_page = 10,
            search,
            is_active
        } = filters;

        const limit = Number(per_page);
        const offset = (page - 1) * limit;

        const where = {};

        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { template_code: { [Op.like]: `%${search}%` } }
            ];
        }

        if (is_active !== undefined) {
            where.is_active = is_active;
        }

        const { rows, count } = await db.productTemplateObj.findAndCountAll({
            where,
            limit,
            offset,
            order: [["created_at", "DESC"]],
        });

        const loadedTillNow = offset + rows.length;
        const remaining = Math.max(count - loadedTillNow, 0);
        const hasMore = loadedTillNow < count;

        return {
            data: rows,
            meta: {
                total: count,
                page,
                per_page: limit,
                current_count: rows.length,
                loaded_till_now: loadedTillNow,
                remaining,
                has_more: hasMore,
                last_page: Math.ceil(count / limit),
            },
        };
    },
    async getProductTemplateById(id) {
        return await db.productTemplateObj.findOne({
            where: {
                id
            }
        });
    },
    async updateProductTemplate(id, updateData) {
        const template = await db.productTemplateObj.findOne({
            where: { id }
        });

        if (!template) {
            return null;
        }

        await template.update(updateData);
        return template;
    },
    async  deleteProductTemplate(id) {
    const template = await db.productTemplateObj.destroy({
        where: { id }
    });

    if (!template) {
        return null;
    }

    
    return template;
}



}