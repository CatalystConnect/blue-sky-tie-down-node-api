var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");


module.exports = {
    /*addChat*/
    async addChat(postData) {
        try {
            let addChat = await db.chatObj.create(postData);
            return addChat;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
     /*getAllChat*/
     async getAllChat( page, length, moduleId ) {
        try {
            limit = length;
            offset = (page - 1) * limit || 0;
            let chat = await db.chatObj.findAll({
                offset,
                limit,
                where:{moduleId: moduleId}
            });
            return chat;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
     /*getsenderById*/
     async getsenderById(userId) {
        try {
            let user = await db.userObj.findOne({
                where: {id : userId}
            });
            return user;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
     /*deleteMessage*/
     async deleteMessage(senderId, messageId) {
        try {
            let user = await db.chatObj.destroy({
                where: {id : messageId, senderId: senderId}
            });
            return user;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getMessage*/
    async getMessage(senderId, messageId) {
        try {
            let user = await db.chatObj.findOne({
                where: {id : messageId, senderId: senderId}
            });
            return user;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
     /*updateMessage*/
     async updateMessage(postData, messageId) {
        try {
            let user = await db.chatObj.update(postData, {
                where: {id : messageId}
            });
            return user;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
     /*getBidById*/
     async getBidById(bidId) {
        try {
            let bid = await db.applyWorkOrderObj.findOne({
                where: {id : bidId}
            });
            return bid;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
};
