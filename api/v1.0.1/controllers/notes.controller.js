require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const notesServices = require("../services/notes.services");
const leadServices = require("../services/lead.services");
const contractServices = require("../services/contract.services");
const authServices = require("../services/auth.services");


const { check, validationResult } = require("express-validator");
const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return error.msg;
    },
});

module.exports = {
    /*addNotes*/
    async addNotes(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let data = req.body;
            let moduleId = data.moduleId;
            let user = await authServices.getUserById(data.userId);
                if (!user) throw new Error("User not found");
            if (data.moduleName == "lead") {
                let lead = await leadServices.getLeadById(moduleId);
                if (!lead) throw new Error("Lead record not found");
            }
            if (data.moduleName == "contractor") {
                let contactor = await contractServices.getContract(moduleId);
                if (!contactor) throw new Error("Contractor record not found");
            }
            if (data.moduleName == "workOrderObj") {
                let workOrder = await notesServices.getWorkOrder(moduleId);
                if (!workOrder) throw new Error("WorkOrder record not found");
            }
            let postData = {
                userId: data.userId,
                moduleName: data.moduleName,
                moduleId: data.moduleId,
                description: data.description
            }
            let noteAdd = await notesServices.addNotes(postData);
             /*addActivity*/
             let moduleName = data.moduleName
             let addingObj = "noteObj"
             postData = { moduleName, addingObj }
             let changes = await commonHelper.compareChanges(postData);
                 let newData = await commonHelper.transformChanges(changes, req.userId, data.moduleId, moduleName)
                 await leadServices.createActivity(newData);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose("", "Notes added successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Notes added failed",
                data: error.response?.data || {}
            });
        }
    },
    /*getNoteById*/
    async getNoteById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let { moduleName, noteId } = req.query;
                let note = await notesServices.getNoteById(moduleName, noteId);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(note, "Note displayed successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Fetching note failed",
                data: error.response?.data || {}
            });
        }
    },
    /*deleteNoteById*/
    async deleteNoteById(req, res) {
        try {
            const errors = myValidationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(200)
                    .send(commonHelper.parseErrorRespose(errors.mapped()));
            }
            let noteId = req.query.noteId;
                let note = await notesServices.getNote( noteId );
                if (!note) throw new Error("Note not found");
                let deleteNote = await notesServices.deleteNote( noteId);
            return res
                .status(200)
                .send(commonHelper.parseSuccessRespose(deleteNote, "Note deleted successfully"));
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.response?.data?.error || error.message || "Deleted note failed",
                data: error.response?.data || {}
            });
        }
    },
    validate(method) {
        switch (method) {
            case "addNotes": {
                return [
                    check("moduleName").not().isEmpty().withMessage("Module Name is Required")
                    .isIn(["leadsObj", "contractObj", "workOrderObj"])
                    .withMessage("Invalid module! Please send these modules only leadsObj, contractObj, workOrderObj"),
                    check("moduleId").not().isEmpty().withMessage("Module Id is Required"),
                    check("description").not().isEmpty().withMessage("Description is Required"),
                    check("userId").not().isEmpty().withMessage("UserId is Required")
                ];
            }
            case "getNoteById": {
                return [
                    check("moduleName").not().isEmpty().withMessage("Module Name is Required")
                    .isIn(["leadsObj", "contractObj", "workOrderObj"])
                    .withMessage("Invalid module! Please send these modules only leadsObj, contractObj, workOrderObj"),
                    check("noteId").not().isEmpty().withMessage("Note Id is Required")
                ];
            }
            case "deleteNoteById": {
                return [
                    check("noteId").not().isEmpty().withMessage("Note Id is Required")
                ];
            }
        }
    }
};
