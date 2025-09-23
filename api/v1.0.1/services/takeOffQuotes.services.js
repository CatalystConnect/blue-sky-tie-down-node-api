var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");

module.exports = {
     /*addTakeOffQuote*/
     async addTakeOffQuote(postData) {
        try {
            let addTakeOffQuote = await db.takeOffQuotesObj.create(postData);
            return addTakeOffQuote;
        }  catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
          }
    },
      /*addTakeOffQuoteItems*/
      async addTakeOffQuoteItems(postData) {
        try {
            let addTakeOffQuote = await db.takeOffQuotesItemsObj.create(postData);
            return addTakeOffQuote;
        }  catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
          }
    },
    /*getAllTakeOffQuote*/
    async getAllTakeOffQuote(page, length, leadId) {
        try {
            limit = length || 10;
            offset = (page - 1) * limit || 0;
            let getAllTakeOffQuote = await db.takeOffQuotesObj.findAll({
                where: {leadId: leadId},
                offset,
                limit,
                order: [["id", "DESC"]],
                include: [
                    {
                        model: db.takeOffQuotesItemsObj,
                        as: "quotes",
                        required: false
                    }
                ]
            });
            return getAllTakeOffQuote;
        }  catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
          }
    },
     /*getTotalRecords*/
     async getTotalRecords(leadId) {
        try {
            let getAllTakeOffQuote = await db.takeOffQuotesObj.findAll({
                where: {leadId: leadId}
            });
            return getAllTakeOffQuote;
        }  catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
          }
    },
     /*getTakeOffQuoteById*/
     async getTakeOffQuoteById(takeOffQuoteId) {
        try {
            let getTakeOffQuoteById = await db.takeOffQuotesObj.findOne({
                where: {id: takeOffQuoteId},
                include: [
                    {
                        model: db.takeOffQuotesItemsObj,
                        as: "quotes",
                        required: false
                    }
                ]
            });
            return getTakeOffQuoteById;
        }  catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
          }
    },
    /*updateTakeOffQuoteById*/
    async updateTakeOffQuoteById(data, takeOffQuoteId) {
        try {
            let updateTakeOffQuoteById = await db.takeOffQuotesObj.update(data, {
                where: {id: takeOffQuoteId}
            });
            return updateTakeOffQuoteById;
        }  catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
          }
    },
    /*deleteTakeOffQuoteById*/
    async deleteTakeOffQuoteById(takeOffQuoteId) {
        try {
            let deleteTakeOffQuoteById = await db.takeOffQuotesObj.destroy({
                where: {id: takeOffQuoteId}
            });
            return deleteTakeOffQuoteById;
        }  catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
          }
    },
     /*addTakeOffQuote*/
     async addTakeOffQuote(postData) {
        try {
            let addTakeOffQuote = await db.takeOffQuotesObj.create(postData);
            return addTakeOffQuote;
        }  catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
          }
    },
      /*addQuoteItems*/
      async addQuoteItems(postData) {
        try {
            let addTakeOffQuote = await db.takeOffQuotesItemsObj.bulkCreate(postData);
            return addTakeOffQuote;
        }  catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
          }
    },
     /*getQuotesById*/
     async getQuotesById(takeOffQuoteId) {
        try {
            let addTakeOffQuote = await db.takeOffQuotesItemsObj.findAll({
                where: {quoteId: takeOffQuoteId}
            });
            return addTakeOffQuote;
        }  catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
          }
    },
     /*updateQuote*/
     async updateQuote(data) {
        try {
            const updatePromises = data.map(async (record) => {
                const id = record.id;
                delete record.id;
                return await db.takeOffQuotesItemsObj.update(
                  {
                    data: record
                  },
                  { where: { id } }
                );
              });
                  const updatedRecords = await Promise.all(updatePromises);
            return updatedRecords;
        }  catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
          }
    },
}