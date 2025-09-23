var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");

module.exports = {
    /*addManufacturer*/
    async addManufacturer(postData) {
        try {
            let manufacturer = await db.manufacturerObj.create(postData);
            return manufacturer;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
     /*getAllManufacturer*/
     async getAllManufacturer(page, length) {
        try {
            limit = length;
            offset = (page - 1) * limit || 0;
            let manufacturer = await db.manufacturerObj.findAll({
                offset,
                limit,
                order: [["id", "DESC"]]
            });
            return manufacturer;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getManufacturerById*/
    async getManufacturerById(manufacturerId) {
        try {
            let manufacturer = await db.manufacturerObj.findOne({
                where: {id: manufacturerId},
                raw: true
            });
            return manufacturer;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
     /*updateManufacturer*/
     async updateManufacturer(postData, manufacturerId) {
        try {
            let manufacturer = await db.manufacturerObj.update(postData, {
                where: {id: manufacturerId}
            });
            return manufacturer;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
     /*deleteManufacturer*/
     async deleteManufacturer(manufacturerId) {
        try {
            let manufacturer = await db.manufacturerObj.destroy({
                where: {id: manufacturerId}
            });
            return manufacturer;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
      /*totalManufacturer*/
      async totalManufacturer() {
        try {
            let manufacturer = await db.manufacturerObj.findAll();
            return manufacturer;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
};
