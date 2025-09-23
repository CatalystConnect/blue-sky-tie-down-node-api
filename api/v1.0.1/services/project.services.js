var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");

module.exports = {
     /*addProject*/
     async addProject(postData) {
        try {
            let addProject = await db.projectObj.create(postData);
            return addProject;
        }  catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
          }
    },
     /*getAllProject*/
     async getAllProject(page, length) {
        try {
            limit = length || 10;
            offset = (page - 1) * limit || 0;
            let getAllProject = await db.projectObj.findAll({
                limit,
                offset,
                order: [["id", "DESC"]]
            });
            return getAllProject;
        }  catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
          }
    },
    /*getProjectById*/
    async getProjectById(projectId) {
        try {
            let getProjectById = await db.projectObj.findOne({
                where: {id: projectId}
            });
            return getProjectById;
        }  catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
          }
    },
    /*updateProject*/
    async updateProject(data, projectId) {
        try {
            let updateProject = await db.projectObj.update(data, {
                where: {id: projectId}
            });
            return updateProject;
        }  catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
          }
    },
    /*deleteProject*/
    async deleteProject(projectId) {
        try {
            let deleteProject = await db.projectObj.destroy({
                where: {id: projectId}
            });
            return deleteProject;
        }  catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
          }
    }
}