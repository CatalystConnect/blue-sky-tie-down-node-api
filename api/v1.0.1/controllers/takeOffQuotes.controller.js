require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const takeOffServices = require("../services/takeOffQuotes.services");
const productCategoryServices = require("../services/productCategory.services");
const leadServices = require("../services/lead.services");
const { check, validationResult } = require("express-validator");
const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return error.msg;
    },
});

module.exports = {
    /*addTakeOffQuote*/
    async addTakeOffQuote(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let userId = req.userId;
            let data = req.body;
            let lead = await leadServices.getLeadById(data.leadId);
            if (!lead) {
                throw new Error("Lead not found");
            }
            let postData = {
                userId: userId,
                leadId: data.leadId,
                customerName: lead.firstName + " " + lead.lastName,
                shipTo: data.shipTo,
                additionalTotal: data.additionalTotal,
                materialTotal: data.materialTotal,
                addtaxable: data.addtaxable,
                customerEmail: lead.email,
                customerPhone: lead.phone,
                status: data.status,
                materialQuality: data.materialQuality
            }
            let addData = await takeOffServices.addTakeOffQuote(postData);


            for (const quote of data.quotes) {
                if(quote.categoryId){
                const categoryId = quote.categoryId;
                const category = await productCategoryServices.getProductCategoryById(categoryId);

                if (!category) {
                    throw new Error(`ProductCategory with ID ${categoryId} not found`);
                }
            }
                let postData = {
                    quoteId: addData.id,
                    data: quote
                }
                await takeOffServices.addTakeOffQuoteItems(postData);

            }
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", "TakeOff Quotes added successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "TakeOff Quotes added failed",
                data: error.response?.data || {}
            });
        }
    },
    /*getAllTakeOffQuote*/
    async getAllTakeOffQuote(req, res) {
        try {
                const errors = myValidationResult(req);
                if (!errors.isEmpty()) {
                    return res
                        .status(200)
                        .send(commonHelper.parseErrorRespose(errors.mapped()));
                }
            let { page, length } = req.query;
            if (page <= 0 || length <= 0) {
                throw new Error("Page and length must be greater than 0");
            }
            let leadId = req.query.leadId
            let getAllTakeOffQuote = await takeOffServices.getAllTakeOffQuote(page, length, leadId);
            if (!getAllTakeOffQuote) throw new Error("TakeOff Quotes not found");
            const takeOffQuotes = getAllTakeOffQuote.map((quoteObj) => {
                const quotes = quoteObj.quotes || [];
              
                const total = quotes.reduce((sum, item) => {
                  return sum + (item.data?.total || 0);
                }, 0);
              
                return {
                  id: quoteObj.dataValues.id,
                  userId: quoteObj.dataValues.userId,
                  leadId: quoteObj.dataValues.leadId,
                  customerName: quoteObj.dataValues.customerName,
                  shipTo: quoteObj.dataValues.shipTo,
                  additionalTotal: quoteObj.dataValues.additionalTotal,
                  materialTotal: quoteObj.dataValues.materialTotal,
                  addtaxable: quoteObj.dataValues.addtaxable,
                  customerEmail: quoteObj.dataValues.customerEmail,
                  customerPhone: quoteObj.dataValues.customerPhone,
                  status: quoteObj.dataValues.status,
                  materialQuality:  quoteObj.dataValues.materialQuality,
                  createdAt: quoteObj.dataValues.createdAt,
                  updatedAt: quoteObj.dataValues.updatedAt,
                  total: total,
                  quotes: quotes
                };
              });
              
            let getTotalRecords = await takeOffServices.getTotalRecords(leadId);
            let response = {
                takeOffQuotes: takeOffQuotes,
                totalRecords: getTotalRecords.length
            }
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(response, "TakeOff Quotes displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Getting TakeOff Quote failed",
                data: error.response?.data || {}
            });
        }
    },
    /*getTakeOffQuoteById*/
    async getTakeOffQuoteById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let takeOffQuoteId = req.query.takeOffQuoteId;
            let getTakeOffQuoteById = await takeOffServices.getTakeOffQuoteById(takeOffQuoteId);
            if (!getTakeOffQuoteById) throw new Error("TakeOffQuote not found");
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(getTakeOffQuoteById, "TakeOff Quotes displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Getting TakeOff Quotes failed",
                data: error.response?.data || {}
            });
        }
    },
    /*updateTakeOffQuoteById*/
    async updateTakeOffQuoteById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let takeOffQuoteId = req.query.takeOffQuoteId;
            let getTakeOffQuoteById = await takeOffServices.getTakeOffQuoteById(takeOffQuoteId);
            if (!getTakeOffQuoteById) throw new Error("TakeOffQuote not found");
            let data = req.body;
            let userId = req.userId
            let lead;
            if (data.leadId) {
                lead = await leadServices.getLeadById(data.leadId);
                if (!lead) throw new Error("Lead not found");
            }
            let postData = {
                userId: userId,
                customerName: lead.firstName + " " + lead.lastName,
                shipTo: data.shipTo,
                additionalTotal: data.additionalTotal,
                materialTotal: data.materialTotal,
                addtaxable: data.addtaxable,
                customerEmail: data.customerEmail,
                customerPhone: data.customerPhone,
                status: data.status,
                materialQuality: data.materialQuality
            }
            let updateTakeOffQuoteById = await takeOffServices.updateTakeOffQuoteById(postData, takeOffQuoteId);

            //updateQuotes//
            let recordsWithUndefinedMaterialId;
            let recordsWithMaterialId;
            if (data.quotes) {
                let materialQuote = (data.quotes || []).map((materialQuote, index) => ({
                    id: materialQuote.id,
                    categoryId: materialQuote.categoryId,
                    categoryName: materialQuote.categoryName,
                    description: materialQuote.description,
                    cost: materialQuote.cost,
                    margin: materialQuote.margin,
                    price: materialQuote.price,
                    quantity: materialQuote.quantity,
                    uom: materialQuote.uom,
                    total: materialQuote.total,
                    uom: materialQuote.uom,
                    productId: materialQuote.productId
                }));
                recordsWithMaterialId = materialQuote.filter(quote => quote.id !== undefined);
                recordsWithUndefinedMaterialId = materialQuote.filter(quote => quote.id === undefined);
            }
            if (recordsWithUndefinedMaterialId.length != 0) {
                await takeOffServices.addQuoteItems(recordsWithUndefinedMaterialId);
            }

            let existingMaterialQuotes = await takeOffServices.getQuotesById(takeOffQuoteId);
            const materialMatchingRecords = recordsWithMaterialId.filter(record =>
                existingMaterialQuotes.some(quote => quote.id === record.id)
            );
            const cleanedMaterialRecords = materialMatchingRecords.map(record => {
                const cleanedRecord = {};
                Object.keys(record).forEach(key => {
                    if (record[key] !== undefined) {
                        cleanedRecord[key] = record[key];
                    }
                });
                return cleanedRecord;
            });
            await takeOffServices.updateQuote(cleanedMaterialRecords);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(updateTakeOffQuoteById, "TakeOffQuote updated successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "TakeOffQuote updation failed",
                data: error.response?.data || {}
            });
        }
    },
    /*deleteTakeOffQuoteById*/
    async deleteTakeOffQuoteById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let takeOffQuoteId = req.query.takeOffQuoteId;
            let getTakeOffQuoteById = await takeOffServices.getTakeOffQuoteById(takeOffQuoteId);
            if (!getTakeOffQuoteById) throw new Error("TakeOffQuote not found");
            let deleteTakeOffQuoteById = await takeOffServices.deleteTakeOffQuoteById(takeOffQuoteId);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(deleteTakeOffQuoteById, "TakeOffQuote deleted successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "TakeOffQuote deletion failed",
                data: error.response?.data || {}
            });
        }
    },
    validate(method) {
        switch (method) {
            case "addTakeOffQuote": {
                return [
                    check("leadId")
                        .not()
                        .isEmpty()
                        .withMessage("LeadId is Required"),
                    check("status")
                        .not()
                        .isEmpty()
                        .withMessage("status is Required").isIn(["pending", "approved", "reject"])
                        .withMessage("Invalid status! Please send these status only pending, approved, reject")
                ]
            }
            case "getTakeOffQuoteById": {
                return [
                    check("takeOffQuoteId").not().isEmpty().withMessage("TakeOffQuote Id is Required")
                ];
            }
            case "getAllTakeOffQuote": {
                return [
                    check("leadId").not().isEmpty().withMessage("Lead Id is Required")
                ];
            }
        }
    }
};
