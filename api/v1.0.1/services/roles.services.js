var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");

module.exports = {
     /*addRole*/
     async addRole(postData) {
        try {
            let role = await db.rolesObj.create(postData);
            return role;
        }  catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
          }
    },
    /*getRoleByName*/
    async getRoleByName(name) {
        try {
            let role = await db.rolesObj.findOne({
                where: {name: name},
                raw: true
            });
            return role;
        }  catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
          }
    },
     /*getAllRoles*/
     async getAllRoles() {
        try {
            let roles = await db.rolesObj.findAll();
            return roles;
        }  catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
          }
    },
    /*getRoleById*/
    async getRoleById(roleId) {
        try {
            let roles = await db.rolesObj.findOne({
                where: {id: roleId}
            });
            return roles;
        }  catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
          }
    },
    /*updateRole*/
    async updateRole(data, roleId) {
        try {
            let roles = await db.rolesObj.update(data, {
                where: {id: roleId}
            });
            return roles;
        }  catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
          }
    },
    /*deleteRole*/
    async deleteRole(roleId) {
        try {
            let deleteRole = await db.rolesObj.destroy({
                where: {id: roleId}
            });
            return deleteRole;
        }  catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
          }
    }
}