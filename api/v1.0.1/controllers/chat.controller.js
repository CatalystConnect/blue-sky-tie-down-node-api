require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const chatServices = require("../services/chat.services");
const authServices = require("../services/auth.services");
const { check, validationResult } = require("express-validator"); // Updated import
const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return error.msg;
    },
});

module.exports = {
    /*addChat*/
    async addChat(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let data = req.body;
            const getsender = await chatServices.getsenderById(data.senderId);
            if (!getsender) throw new Error("Sender not found");
            const getReciever = await chatServices.getsenderById(data.recieverId);
            if (!getReciever) throw new Error("Reciever not found");
            const getBidById = await chatServices.getBidById(data.moduleId);
            if (!getBidById) throw new Error("Bid not found");
            let postData = {
                senderId: data.senderId,
                recieverId: data.recieverId,
                message: data.message,
                module: data.module,
                moduleId: data.moduleId
            }
            await chatServices.addChat(postData);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", "Chat added successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Add chat failed",
                data: error.response?.data || {}
            });
        }

    },
    /*getAllChat*/
    async getAllChat(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let { page, length } = req.query;
            if (page <= 0 || length <= 0) throw new Error("Page and length must be greater than 0");
            let moduleId  = req.query.moduleId;
            const getBidById = await chatServices.getBidById(moduleId);
            if (!getBidById) throw new Error("Bid not found");
            let chat = await chatServices.getAllChat(page, length, moduleId);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(chat, "Chat displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Fetching chat failed",
                data: error.response?.data || {}
            });
        }

    },
    /*deleteMessage*/
    async deleteMessage(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let { senderId, messageId } = req.query;
            const getsender = await chatServices.getsenderById(senderId);
            if (!getsender) throw new Error("Sender not found");
            let getMessage = await chatServices.getMessage(senderId, messageId);
            if (!getMessage) throw new Error("Message not found");
            let deleteMessage = await chatServices.deleteMessage(senderId, messageId);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(deleteMessage, "Message delete successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Deleting chat failed",
                data: error.response?.data || {}
            });
        }

    },
     /*updateMessage*/
     async updateMessage(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let { senderId, messageId } = req.query;
            let message = req.body.message;
            const getsender = await chatServices.getsenderById(senderId);
            if (!getsender) throw new Error("Sender not found");
            let getMessage = await chatServices.getMessage(senderId, messageId);
            if (!getMessage) throw new Error("Message not found");
            let postData = {
                message: message
            }
            let updateMessage = await chatServices.updateMessage(postData, messageId);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(updateMessage, "Message updated successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Updated chat failed",
                data: error.response?.data || {}
            });
        }

    },

    validate(method) {
        switch (method) {
            case "addChat": {
                return [
                    check("senderId").not().isEmpty().withMessage("Sender id is required"),
                    check("recieverId").not().isEmpty().withMessage("Reciever id is required"),
                    check("message").not().isEmpty().withMessage("Message is Required"),
                    check("moduleId").not().isEmpty().withMessage("Module id is required"),
                    check("module").not().isEmpty().withMessage("Module is Required")
                    .isIn(["bid"])
                    .withMessage("Invalid module! Please send module only bid"),
                ];
            }
            case "getAllChat": {
                return [
                    check("moduleId").not().isEmpty().withMessage("Module id is required")
                ];
            }
            case "deleteMessage": {
                return [
                    check("senderId").not().isEmpty().withMessage("Sender id is required"),
                    check("messageId").not().isEmpty().withMessage("Message id is required"),

                ];
            }
            case "updateMessage": {
                return [
                    check("senderId").not().isEmpty().withMessage("Sender id is required"),
                    check("messageId").not().isEmpty().withMessage("Message id is required")
                ];
            }
        }
    }
};
