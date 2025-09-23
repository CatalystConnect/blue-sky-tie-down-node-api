var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");

module.exports = {
    /*getActivitiesById*/
    async getActivitiesById( moduleName, activityId ) {
        try {
            let activities = await db.activitiesObj.findAll({
                where: { moduleId: activityId, moduleName: moduleName, isDeleted:null },
                order: [["id", "DESC"]]
            })
            return activities;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*updateActivity*/
    async updateActivity(data, noteId, module) {
        try {
            let updateActivity = await db.activitiesObj.update(data, {
                where: {moduleId: noteId, moduleName: module},
            });
            return updateActivity;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    }
};
