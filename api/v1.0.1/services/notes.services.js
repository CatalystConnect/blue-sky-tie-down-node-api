var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");

module.exports = {
    /*getWorkOrder*/
    async getWorkOrder(workOrderId) {
        try {
            let workOrder = await db.workOrderObj.findOne({
                where: { id: workOrderId }
            });
            return workOrder;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*addNotes*/
    async addNotes(data) {
        try {
            let note = await db.notesObj.create(data);
            return note;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getNoteById*/
    async getNoteById(moduleName, noteId) {
        try {
            let note = await db.notesObj.findAll({
                where: {moduleId: noteId, moduleName: moduleName, isDeleted: null},
            });
            return note;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getNote*/
    async getNote( noteId ) {
        try {
            let note = await db.notesObj.findOne({
                where: {id: noteId, isDeleted: null},
            });
            return note;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*deleteNote*/
    async deleteNote( noteId ) {
        try {
            let note = await db.notesObj.destroy({
                where: {id: noteId},
            });
            return note;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
     /*updateNote*/
     async updateNotes(data, noteId, module) {
        try {
            let note = await db.notesObj.update(data, {
                where: {moduleId: noteId, moduleName: module},
            });
            return note;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    }
}