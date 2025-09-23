var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op } = require("sequelize");

module.exports = {
  /*addSaleMaterialQuotes*/
  async addSaleMaterialQuotes(postData) {
    try {
      let saleMaterialQuotes = await db.saleMaterialQuotesObj.create(postData);
      return saleMaterialQuotes;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*getAllSaleMaterialQuotes*/
  async getAllSaleMaterialQuotes({ page, per_page, search }) {
    try {
      const limit = parseInt(per_page);
      const offset = (page - 1) * limit;

      let whereCondition = {};
      if (search) {
        whereCondition = {
          [Op.or]: [
            { customer_details: { [Op.like]: `%${search}%` } },
            { ship_to: { [Op.like]: `%${search}%` } },
            { notes: { [Op.like]: `%${search}%` } },
          ],
        };
      }

      const { rows, count } = await db.saleMaterialQuotesObj.findAndCountAll({
        where: whereCondition,
        limit,
        offset,
        order: [["created_at", "DESC"]],
        include: [
          {
            model: db.userObj,
            as: "customer",
            // attributes: ["id", "name"],
          },
          {
            model: db.contractObj,
            as: "contractor",
            attributes: ["id", "contractorName"],
          },
          {
            model: db.leadsObj,
            as: "lead",
            include: [
              {
                model: db.userObj,
                as: "customer",
                attributes: ["id", "firstName", "lastName","email", "phoneNumber"],
              },
            ],
          },
        ],
      });

      return {
        total: count,
        page: parseInt(page),
        per_page: limit,
        totalPages: Math.ceil(count / limit),
        SaleMaterialQuotes: rows,
      };
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*getSaleMaterialQuotesById*/
  async getSaleMaterialQuotesById(saleMaterialQuotesId) {
    try {
      let saleMaterialQuotes = await db.saleMaterialQuotesObj.findOne({
        where: { id: saleMaterialQuotesId },
        include: [
          {
            model: db.userObj,
            as: "customer",
            // attributes: ["id", "name"] // customize fields
          },
          {
            model: db.saleAdditionalQuotesitemObj,
            as: "item",
            // attributes: ["id", "itemName", "sku"]
          },
          {
            model: db.SaleMaterialQuoteHeaderTabsObj,
            as: "headerTabs",
          },
          {
            model: db.saleAdditionalQuotesObj,
            as: "additionalQuotes",
            include: [
              {
                model: db.saleAdditionalQuotesitemObj,
                as: "additionalQuoteItems",
              },
            ],
          },
        ],
      });

      return saleMaterialQuotes;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*deleteSaleMaterialQuotes*/
  async deleteSaleMaterialQuotes(saleMaterialQuotesId) {
    try {
      let saleMaterialQuotes = await db.saleMaterialQuotesObj.destroy({
        where: { id: saleMaterialQuotesId },
      });
      return saleMaterialQuotes;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  async addHeaderTabs(headerData) {
    try {
      const result = await db.SaleMaterialQuoteHeaderTabsObj.create(headerData);
      return result;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  async addAdditionalTabs(additionalData) {
    try {
      if (!additionalData || additionalData.length === 0) {
        return [];
      }

      const result = await db.saleAdditionalQuotesObj.bulkCreate(
        additionalData,
        { returning: true }
      );

      return result;
    } catch (error) {
      throw new Error("Failed to add additional items: " + error.message);
    }
  },
  async addMaterialItems(materialItemsData) {
    try {
      const items = await db.saleAdditionalQuotesitemObj.bulkCreate(
        materialItemsData,
        {
          returning: true,
        }
      );

      return {
        status: true,
        message: "Material items added successfully",
        data: items,
      };
    } catch (error) {
      console.error("Error in addMaterialItems service:", error);
      throw new Error("Failed to add material items: " + error.message);
    }
  },
  async updateSaleMaterialQuotes(id, data) {
    return await db.saleMaterialQuotesObj.update(data, { where: { id } });
  },

  async deleteHeaderTabs(quoteId) {
    return await db.SaleMaterialQuoteHeaderTabsObj.destroy({
      where: { material_quote_id: quoteId },
    });
  },
  async deleteAdditionalTabs(quoteId) {
    return await db.saleAdditionalQuotesObj.destroy({
      where: { material_quote_id: quoteId },
    });
  },

  async deleteMaterialItems(quoteId) {
    return await db.saleAdditionalQuotesitemObj.destroy({
      where: { material_quote_id: quoteId },
    });
  },
  async CheckleadContractor(leadId) {
    try {
      const record = await db.saleMaterialQuotesObj.findOne({
        where: { lead_project_id: leadId, contractor_id: { [Op.ne]: null } },
      });

      return record ? true : false;
    } catch (error) {
      throw error;
    }
  },
  async getAllItemAndServicesTypeItem(search) {
    try {
      // let itemWhere = {};
      let serviceWhere = {};

      if (search) {
        // itemWhere = {
        //   [db.Sequelize.Op.or]: [

        //     { sku: { [db.Sequelize.Op.iLike]: `%${search}%` } },
        //   ],
        // };

        serviceWhere = {
          [db.Sequelize.Op.or]: [
            { item_name: { [db.Sequelize.Op.iLike]: `%${search}%` } },
          ],
        };
      }

      // let items = await db.itemObj.findAll({
      //   where: itemWhere,
      //   attributes: ["id", "sku"],
      //   raw: true,
      //   limit: 5,
      // });

      let services = await db.serviceTypeitemsObj.findAll({
        where: serviceWhere,
        attributes: ["id", "item_name", "inventory_id"],
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
                  {
                    model: db.unitObj,
                    as: "unit",
                  },
                ],
              },
              { model: db.itemVendorObj, as: "item_vendors" },
              { model: db.itemWebsObj, as: "item_webs" },
              { model: db.itemImagesObj, as: "item_images" },
            ],
          },
        ],
        raw: false,
        limit: 10,
      });

      // let itemGroup = {
      //   Inventory: items.map((item) => ({
      //     value: item.id,
      //     label: item.sku,
      //   })),
      // };

      let serviceGroup = {
        Services: services.map((s) => ({
          value: s.id,
          label: s.item_name,
          inventory: s.inventory || null,
        })),
      };

      return [serviceGroup];
    } catch (error) {
      throw error;
    }
  },

  async getAllItemAndServicesTypeItemByID(itemId, itemName) {
    try {
      let result = null;

      if (itemId || itemName) {
        result = await db.itemObj.findOne({
          where: {
            ...(itemId && { id: itemId }),
            ...(itemName && {
              sku: { [db.Sequelize.Op.iLike]: `%${itemName}%` },
            }),
          },
          include: [
            { model: db.brandItemObj, as: "item_brands" },
            { model: db.itemTagObj, as: "item_tags" },
            { model: db.itemCategoriesObj, as: "item_categories" },
            {
              model: db.itemUnitsObj,
              as: "item_units",
              include: [
                {
                  model: db.unitObj,
                  as: "unit",
                },
              ],
            },
            { model: db.itemVendorObj, as: "item_vendors" },
            { model: db.itemWebsObj, as: "item_webs" },
            { model: db.itemImagesObj, as: "item_images" },
            {
              model: db.serviceTypeitemsObj,
              as: "serviceItems",
            },
          ],
          order: [
            [{ model: db.itemImagesObj, as: "item_images" }, "id", "ASC"],
            [{ model: db.itemUnitsObj, as: "item_units" }, "id", "ASC"],
            [{ model: db.itemVendorObj, as: "item_vendors" }, "id", "ASC"],
            [{ model: db.itemWebsObj, as: "item_webs" }, "id", "ASC"],
            [
              { model: db.itemCategoriesObj, as: "item_categories" },
              "id",
              "ASC",
            ],
            [{ model: db.itemTagObj, as: "item_tags" }, "id", "ASC"],
          ],
          raw: false,
          nest: true,
        });

        if (result) {
          return result;
        }
      }

      // result = await db.serviceTypeitemsObj.findOne({
      //   where: {
      //     ...(itemId && { id: itemId }),
      //     ...(itemName && { item_name: { [db.Sequelize.Op.iLike]: `%${itemName}%` } }),
      //   },
      //   include: [
      //     {
      //       model: db.unitObj,
      //       as: "unit",

      //     },
      //     {
      //       model: db.itemObj,
      //       as: "inventory",

      //     },
      //   ],

      //   raw: false,
      //   nest: true,
      // });

      // if (result) {

      //   return {
      //     item_units: [
      //       {
      //         id: result.id,
      //         item_name: result.item_name,
      //         zip_code: result.zip_code,
      //         service_region: result.service_region,
      //         qty: result.qty,
      //         per: result.per,
      //         tax: result.tax,
      //         contractor: result.contractor,
      //         UOM: result.unit,
      //         std_cost: result.std_cost,
      //         last_cost: result.last_cost,
      //         average_cost: result.average_cost,
      //         margin: result.margin,
      //         price: result.price,
      //         lead_time: result.lead_time,
      //         calc_lead_time: result.calc_lead_time,
      //         expiration_date: result.expiration_date,
      //         effective_date: result.effective_date,
      //         last_sold_date: result.last_sold_date,
      //         fut_effective_date: result.fut_effective_date,
      //         fut_effective_cost: result.fut_effective_cost,
      //         notes: result.notes,
      //         created_at: result.created_at,
      //         updated_at: result.updated_at,
      //         inventoryId: result.inventory_id,
      //         inventory:result.inventory,
      //       },
      //     ],
      //   };
      // }

      return null;
    } catch (error) {
      throw error;
    }
  },
  // async getAllItemAndServicesTypeItemByID(itemId, itemName) {
  //   try {
  //     let result = await db.serviceTypeitemsObj.findOne({
  //       where: {
  //         ...(itemId && { id: itemId }),
  //         ...(itemName && { item_name: { [db.Sequelize.Op.iLike]: `%${itemName}%` } }),
  //       },
  //       include: [
  //         {
  //           model: db.unitObj,
  //           as: "unit",
  //         },
  //         {
  //           model: db.itemObj,
  //           as: "inventory",
  //           include: [
  //             { model: db.brandItemObj, as: "item_brands" },
  //             { model: db.itemTagObj, as: "item_tags" },
  //             { model: db.itemCategoriesObj, as: "item_categories" },
  //             {
  //               model: db.itemUnitsObj,
  //               as: "item_units",
  //               include: [{ model: db.unitObj, as: "unit" }],
  //             },
  //             { model: db.itemVendorObj, as: "item_vendors" },
  //             { model: db.itemWebsObj, as: "item_webs" },
  //             { model: db.itemImagesObj, as: "item_images" },
  //           ],
  //         },
  //       ],
  //       order: [
  //         [
  //           { model: db.itemObj, as: "inventory" },
  //           { model: db.itemImagesObj, as: "item_images" },
  //           "id",
  //           "ASC",
  //         ],
  //         [
  //           { model: db.itemObj, as: "inventory" },
  //           { model: db.itemUnitsObj, as: "item_units" },
  //           "id",
  //           "ASC",
  //         ],
  //         [
  //           { model: db.itemObj, as: "inventory" },
  //           { model: db.itemVendorObj, as: "item_vendors" },
  //           "id",
  //           "ASC",
  //         ],
  //         [
  //           { model: db.itemObj, as: "inventory" },
  //           { model: db.itemWebsObj, as: "item_webs" },
  //           "id",
  //           "ASC",
  //         ],
  //         [
  //           { model: db.itemObj, as: "inventory" },
  //           { model: db.itemCategoriesObj, as: "item_categories" },
  //           "id",
  //           "ASC",
  //         ],
  //         [
  //           { model: db.itemObj, as: "inventory" },
  //           { model: db.itemTagObj, as: "item_tags" },
  //           "id",
  //           "ASC",
  //         ],
  //       ],
  //       raw: false,
  //       nest: true,
  //     });

  //     if (result) {
  //       return {
  //         item_units: {
  //           id: result.id,
  //           item_name: result.item_name,
  //           zip_code: result.zip_code,
  //           service_region: result.service_region,
  //           qty: result.qty,
  //           per: result.per,
  //           tax: result.tax,
  //           contractor: result.contractor,
  //           UOM: result.unit,
  //           std_cost: result.std_cost,
  //           last_cost: result.last_cost,
  //           average_cost: result.average_cost,
  //           margin: result.margin,
  //           price: result.price,
  //           lead_time: result.lead_time,
  //           calc_lead_time: result.calc_lead_time,
  //           expiration_date: result.expiration_date,
  //           effective_date: result.effective_date,
  //           last_sold_date: result.last_sold_date,
  //           fut_effective_date: result.fut_effective_date,
  //           fut_effective_cost: result.fut_effective_cost,
  //           notes: result.notes,
  //           created_at: result.created_at,
  //           updated_at: result.updated_at,
  //         },
  //         inventory: result.inventory, // pura inventory data nested relations de naal
  //       };
  //     }

  //     return null;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
};
