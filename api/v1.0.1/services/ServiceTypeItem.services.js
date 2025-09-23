var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op } = require("sequelize");
const XLSX = require("xlsx");

module.exports = {
  /*addServiceTypeItem*/
  async addServiceTypeItem(postData) {
    try {
      let serviceTypeItem = await db.serviceTypeitemsObj.create(postData);
      return serviceTypeItem;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  async getServiceTypeItemById(serviceTypeItemId) {
    try {
      let serviceTypeItem = await db.serviceTypeitemsObj.findOne({
        where: { id: serviceTypeItemId },
      });
      return serviceTypeItem;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  async getAllServiceTypeItems({ page, per_page, search }) {
    try {
      const limit = parseInt(per_page);
      const offset = (page - 1) * limit;

      const { rows, count } = await db.serviceTypeitemsObj.findAndCountAll({
        limit,
        offset,
        order: [["created_at", "DESC"]],
        include: [
          {
            model: db.itemObj,
            as: "inventory",
            attributes: ["id", "sku"],
          },
          {
            model: db.contractObj,
            as: "contract",
          },
        ],
      });

      return {
        total: count,
        page: parseInt(page),
        per_page: limit,
        totalPages: Math.ceil(count / limit),
        tag: rows,
      };
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  async deleteServiceTypeItems(serviceTypeItemId) {
    try {
      let deleteServiceType = await db.serviceTypeitemsObj.destroy({
        where: { id: serviceTypeItemId },
      });
      return deleteServiceType;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  async updateServiceTypeItems(data, serviceTypeItemId) {
    try {
      let updateserviceType = await db.serviceTypeitemsObj.update(data, {
        where: { id: serviceTypeItemId },
      });
      return updateserviceType;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  //   async getAllServiceTypeById({ itemId, itemName }) {
  //     try {
  //       const whereClause = {};
  //       if (itemId) whereClause.inventory_id = itemId;
  //       if (itemName) whereClause.item_name = itemName; // only if you want filter by name

  //       const serviceTypeItemsData = await db.serviceTypeitemsObj.findAll({
  //         where: whereClause,
  //         include: [
  //           {
  //             model: db.itemObj,
  //             as: "inventory",
  //             include: [
  //               { model: db.brandItemObj, as: "item_brands" },
  //               { model: db.itemTagObj, as: "item_tags" },
  //               { model: db.itemCategoriesObj, as: "item_categories" },
  //               {
  //                 model: db.itemUnitsObj,
  //                 as: "item_units",
  //                 include: [{ model: db.unitObj, as: "unit" }],
  //               },
  //               { model: db.itemVendorObj, as: "item_vendors" },
  //               { model: db.itemWebsObj, as: "item_webs" },
  //               { model: db.itemImagesObj, as: "item_images" },
  //             ],
  //           },
  //         ],
  //       });

  //       return serviceTypeItemsData;
  //     } catch (e) {
  //       logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //       throw e;
  //     }
  //   },
  async getAllServiceTypeById({ itemId }) {
    try {
      const whereClause = {};
      if (itemId) whereClause.inventory_id = itemId;

      const serviceTypeItemsData = await db.serviceTypeitemsObj.findAll({
        where: whereClause,
        include: [
          {
            model: db.itemObj,
            as: "inventory",
            include: [
              { model: db.brandItemObj, as: "item_brands" },
              { model: db.itemTagObj, as: "item_tags" },
              { model: db.itemCategoriesObj, as: "item_categories" },
              {
                model: db.itemUnitsObj,
                as: "item_units",
                include: [
                  { model: db.unitObj, as: "unit" },
                  { model: db.unitObj, as: "base" },
                ],
              },
              { model: db.itemVendorObj, as: "item_vendors" },
              { model: db.itemWebsObj, as: "item_webs" },
              { model: db.itemImagesObj, as: "item_images" },
            ],
          },
        ],
      });

      if (!serviceTypeItemsData || serviceTypeItemsData.length === 0) {
        return null;
      }

      const inventoryData = serviceTypeItemsData[0].inventory.toJSON();

      inventoryData.item_units = inventoryData.item_units.map((unit) => {
        let baseData = null;

        // only attach full base info if THIS unit is the base
        if (unit.isBase) {
          baseData = {
            id: unit.base?.id || null,
            name: unit.base?.name || null,
            qty: unit.qty || null,
          };
        }

        return {
          ...unit,
          base: baseData, // 👈 base is only filled for isBase=true
        };
      });

      const serviceItems = serviceTypeItemsData.map((s) => {
        const { inventory, ...serviceTypeItemData } = s.toJSON();
        return serviceTypeItemData;
      });

      return {
        ...inventoryData,
        serviceItems,
      };
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  async importServiceTypeItem(filePath) {
    let inserted = 0;
    let updated = 0;
    let skipped = 0;

    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      for (let i = 0; i < sheetData.length; i++) {
        const row = sheetData[i];

        try {
          const inventoryId = row["inventoryId"];
          if (!inventoryId) {
            skipped++;
            continue;
          }

          const inventoryItem = await db.itemObj.findByPk(inventoryId);
          if (!inventoryItem) {
            skipped++;
            continue;
          }

          const directFields = {
            item_name: row["itemName"],
            zip_code: row["zipCode"],
            service_region: row["serviceRegion"],
            contractor: row["contractor"],
            uom: row["uom"],
            std_cost: row["stdCost"],
            last_cost: row["lastCost"],
            average_cost: row["averageCost"],
            margin: row["margin"],
            price: row["price"],
            qty: row["qty"],
            per: row["per"],
            tax: row["tax"],
            lead_time: row["leadTime"],
            calc_lead_time: row["calcLeadTime"],
            expiration_date: commonHelper.parseExcelDate(row["expirationDate"]),
            effective_date: commonHelper.parseExcelDate(row["effectiveDate"]),
            last_sold_date: commonHelper.parseExcelDate(row["lastSoldDate"]),
            fut_effective_date: commonHelper.parseExcelDate(
              row["futEffectiveDate"]
            ),
            fut_effective_cost: row["futEffectiveCost"],
            notes: row["notes"],
            inventory_id: inventoryId,
          };

          const [serviceTypeItem, created] =
            await db.serviceTypeitemsObj.findOrCreate({
              where: { inventory_id: inventoryId },
              defaults: directFields,
            });

          if (!created) {
            await serviceTypeItem.update(directFields);
            updated++;
          } else {
            inserted++;
          }
        } catch (rowError) {
          console.error(`Row ${i + 1} skipped:`, rowError.message);
          skipped++;
          continue;
        }
      }

      return { inserted, updated, skipped };
    } catch (error) {
      console.error("Fatal error during import:", error);
      return {
        inserted,
        updated,
        skipped,
        error: error.message || error.toString(),
      };
    }
  },
};
