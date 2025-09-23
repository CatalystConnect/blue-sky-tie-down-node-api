var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");

module.exports = {
    /*addInventory*/
    async addInventory(postData) {
        try {
            let inventory = await db.inventoryObj.create(postData);
            return inventory;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getAllInventory*/
    async getAllInventory(page, length) {
        try {
            limit = length || 10;
            offset = (page - 1) * limit || 0;
            let inventory = await db.inventoryObj.findAll({
                limit,
                offset,
                order: [["id", "DESC"]],
                include: [
                    {
                        model: db.inventoryImagesObj,
                        as: "gallery",
                        attributes: { exclude: ["createdAt", "updatedAt"] },
                        order: [["id", "DESC"]],
                        required: false
                    }
                ]     
                          }
            );
            return inventory;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
      /*totalInventories*/
      async totalInventories() {
        try {
            let inventory = await db.inventoryObj.findAll();
            return inventory;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*getInventoryById*/
    async getInventoryById(inventoryId) {
        try {
            let inventory = await db.inventoryObj.findOne({
                where: { id: inventoryId },
            });
            return inventory;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*updateInventorById*/
    async updateInventorById(data, inventoryId) {
        try {
            let inventory = await db.inventoryObj.update(data, {
                where: { id: inventoryId }
            });
            return inventory;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
    /*deleteInventory*/
    async deleteInventory(inventoryId) {
        try {
            let getInventoryById = await db.inventoryObj.destroy({
                where: { id: inventoryId },
            });
            return getInventoryById;
        } catch (e) {
            logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
            throw e;
        }
    },
/*addProductGallery*/
async addProductGallery(postData) {
    try {
        let inventory = await db.inventoryImagesObj.create(postData);
        return inventory;
    } catch (e) {
        logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
        throw e;
    }
},
/*deleteProductGallery*/
async deleteProductGallery(inventoryId) {
    try {
        let getInventoryById = await db.inventoryImagesObj.destroy({
            where: { inventoryId: inventoryId },
        });
        return getInventoryById;
    } catch (e) {
        logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
        throw e;
    }
},
};
