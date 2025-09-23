var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");

module.exports = {
    /* addTickets */
    async addTickets(postData) {
        try {
            let ticket = await db.ticketsObj.create(postData);
            return ticket;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    async getAllTickets(page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;

            const { count, rows } = await db.ticketsObj.findAndCountAll({
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [["id", "DESC"]],
                include: [
                    {
                        model: db.leadsObj,
                        as: "lead",

                    },
                    {
                        model: db.tagsObj,
                        as: "tags",

                    },
                ],
            });

            return {
                total: count,
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                tickets: rows,
            };
        } catch (error) {
            throw error;
        }
    },
    async getTicketsById(ticketId) {
        try {
            const ticket = await db.ticketsObj.findOne({
                where: { id: ticketId },
                include: [
                    {
                        model: db.leadsObj,
                        as: "lead",

                    },
                    {
                        model: db.tagsObj,
                        as: "tags",

                    },
                ],
            });
            return ticket;
        } catch (error) {
            throw error;
        }
    },
    async deleteTickets(ticketId) {
        try {
            const ticket = await db.ticketsObj.findOne({ where: { id: ticketId } });
            if (!ticket) {
                return null; // ticket not found
            }

            await db.ticketsObj.destroy({
                where: { id: ticketId }
            });

            return true;
        } catch (error) {
            throw error;
        }
    },
    async updateTickets(id, postData) {
        try {
            const ticket = await db.ticketsObj.findOne({ where: { id } });
            if (!ticket) {
                throw new Error("Ticket not found");
            }

            await ticket.update(postData);
            return ticket;
        } catch (error) {
            throw error;
        }
    },
};
