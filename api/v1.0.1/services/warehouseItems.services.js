var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op, Sequelize } = require("sequelize");

module.exports = {
  async addwareHouseItems(postData) {
    try {
      const wareHouseItem = await db.warehouseItemsObj.create(postData);
      return wareHouseItem;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /* Get WareHouse By Id */
  async getWareHouseItemById(wareHouseId) {
    try {
      const wareHouseItem = await db.warehouseItemsObj.findOne({
        where: { id: wareHouseId },

      });

      if (!wareHouseItem) return null;
      return wareHouseItem;
      // return {
      //   item: wareHouseItem.item || "",
      //   searchItem: wareHouseItem.searchItem || "",
      //   keyFields: {
      //     itemNumber: wareHouseItem.itemNumber,
      //     description: wareHouseItem.description,
      //     date: wareHouseItem.date,
      //     contractor_id: wareHouseItem.contractor_id,
      //     contractor: wareHouseItem.contractorData
      //   },
      //   pricing: {
      //     per: wareHouseItem.per,
      //     listPrice: wareHouseItem.listPrice,
      //     fullList: wareHouseItem.fullList,
      //     fullRetail: wareHouseItem.fullRetail,
      //     unitCost: wareHouseItem.unitCost,
      //     effectiveDate: wareHouseItem.effectiveDate,
      //   },
      //   costing: {
      //     costPerEA: wareHouseItem.costPerEA,
      //     stdCost: wareHouseItem.stdCost,
      //     fullStd: wareHouseItem.fullStd,
      //     average: wareHouseItem.average,
      //     lastAvg: wareHouseItem.lastAvg,
      //     lastLand: wareHouseItem.lastLand,
      //     baseCost: wareHouseItem.baseCost,
      //   },
      //   quantities: {
      //     onHand: wareHouseItem.onHand,
      //     committed: wareHouseItem.committed,
      //     available: wareHouseItem.available,
      //     triRegOut: wareHouseItem.triRegOut,
      //     triTotalOut: wareHouseItem.triTotalOut,
      //     backorder: wareHouseItem.backorder,
      //     rented: wareHouseItem.rented,
      //     onPO: wareHouseItem.onPO,
      //     tranRegIn: wareHouseItem.tranRegIn,
      //     tranTotalIn: wareHouseItem.tranTotalIn,
      //     webAllow: wareHouseItem.webAllow,
      //     qtyAvail: wareHouseItem.qtyAvail,
      //     workOrder: wareHouseItem.workOrder,
      //   },
      //   locations: {
      //     shipping: wareHouseItem.shipping,
      //     receiving: wareHouseItem.receiving,
      //   },
      //   units: {
      //     webAllow: wareHouseItem.webAllow,
      //     allow: wareHouseItem.allow,
      //     uM: wareHouseItem.uM,
      //     qtyAvail: wareHouseItem.qtyAvail,
      //   },
      //   purchasing: {
      //     buyerType: wareHouseItem.buyerType,
      //     replenishPath: wareHouseItem.replenishPath,
      //     seasonal: wareHouseItem.seasonal,
      //     safetyStock: wareHouseItem.safetyStock,
      //     minQty: wareHouseItem.minQty,
      //     maxQty: wareHouseItem.maxQty,
      //     leadTime: wareHouseItem.leadTime,
      //     reorderPoint: wareHouseItem.reorderPoint,
      //   },
      //   costingAdditions: {
      //     standardCost: wareHouseItem.standardCost,
      //     baseCost: wareHouseItem.addBaseCost,
      //     lastCost: wareHouseItem.lastCost,
      //     averageCost: wareHouseItem.averageCost,
      //     workingCost: wareHouseItem.workingCost,
      //     costAdditions: wareHouseItem.costAdditions,
      //   },
      // };
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  async getAllWareHouseItems({ page, per_page, search, limit }) {
    try {
      const offset = (page - 1) * per_page;
      const queryLimit = limit ? parseInt(limit) : per_page;

      let whereCondition = {};
      if (search) {
        whereCondition = {
          [Op.or]: [
            { itemNumber: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } },
          ],
        };
      }

      const { rows, count } = await db.warehouseItemsObj.findAndCountAll({
        where: whereCondition,
        include: [{
          model: db.itemObj,
          as: 'item',
          
        },
        {
          model: db.wareHouseObj,
          as: 'warehouse',
          
        }
      ],

        limit: queryLimit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      // const formattedData = rows.map((item) => ({
      //   item: item.id,
      //   searchItem: search,
      //   keyFields: {
      //     itemNumber: item.itemNumber,
      //     description: item.description,
      //     date: item.date,
      //     contractor: item.contractor,
      //   },
      //   pricing: {
      //     per: item.per,
      //     listPrice: item.listPrice,
      //     fullList: item.fullList,
      //     fullRetail: item.fullRetail,
      //     unitCost: item.unitCost,
      //     effectiveDate: item.effectiveDate,
      //   },
      //   costing: {
      //     costPerEA: item.costPerEA,
      //     stdCost: item.stdCost,
      //     fullStd: item.fullStd,
      //     average: item.average,
      //     lastAvg: item.lastAvg,
      //     lastLand: item.lastLand,
      //     baseCost: item.baseCost,
      //   },
      //   quantities: {
      //     onHand: item.onHand,
      //     committed: item.committed,
      //     available: item.available,
      //     triRegOut: item.triRegOut,
      //     triTotalOut: item.triTotalOut,
      //     backorder: item.backorder,
      //     rented: item.rented,
      //     onPO: item.onPO,
      //     tranRegIn: item.tranRegIn,
      //     tranTotalIn: item.tranTotalIn,
      //     webAllow: item.webAllow,
      //     qtyAvail: item.qtyAvail,
      //     workOrder: item.workOrder,
      //   },
      //   locations: {
      //     shipping: item.shipping,
      //     receiving: item.receiving,
      //   },
      //   units: {
      //     webAllow: item.webAllow,
      //     allow: item.allow,
      //     uM: item.uM,
      //     qtyAvail: item.qtyAvail,
      //   },
      //   purchasing: {
      //     buyerType: item.buyerType,
      //     replenishPath: item.replenishPath,
      //     seasonal: item.seasonal,
      //     safetyStock: item.safetyStock,
      //     minQty: item.minQty,
      //     maxQty: item.maxQty,
      //     leadTime: item.leadTime,
      //     reorderPoint: item.reorderPoint,
      //   },
      //   costingAdditions: {
      //     standardCost: item.standardCost,
      //     baseCost: item.baseCost,
      //     lastCost: item.lastCost,
      //     averageCost: item.averageCost,
      //     workingCost: item.workingCost,
      //     costAdditions: item.costAdditions,
      //   },
      // }));

      // return {
      //   total: count,
      //   page,
      //   per_page,
      //   data: rows,
      // };
      const totalPages = queryLimit ? Math.ceil(count / queryLimit) : 1;

      return {
        data: rows,
        meta: {
          total: count,
          page,
          per_page: queryLimit,
          total_pages: totalPages,
        }
      };
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  async deletewareHouseItems(wareHouseId) {
    try {
      const deleted = await db.warehouseItemsObj.destroy({
        where: { id: wareHouseId },
      });
      return deleted;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  // async updateWareHouseItems(wareHouseId, data) {
  //   try {
  //     const wareHouseItem = await db.warehouseItemsObj.findOne({
  //       where: { id: wareHouseId },
  //     });

  //     if (!wareHouseItem) return null;

  //     await wareHouseItem.update(data);

  //     const updatedItem = await db.warehouseItemsObj.findOne({
  //       where: { id: wareHouseId },
  //       raw: true,
  //     });

  //     return updatedItem;
  //   } catch (e) {
  //     logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //     throw e;
  //   }
  // },
  async updateWareHouseItems(id, payload) {
    try {

      const item = await db.warehouseItemsObj.findByPk(id);

      if (!item) {
        throw new Error("Warehouse item not found");
      }


      if (payload.id) delete payload.id;


      await item.update(payload);

      return item;

    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
