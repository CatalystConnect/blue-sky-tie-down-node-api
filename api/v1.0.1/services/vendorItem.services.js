var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op } = require("sequelize");

module.exports = {
  /*addVendorsItem*/
  async addVendorsItem(postData) {
    try {
      let vendor = await db.vendorItemObj.create(postData);
      return vendor;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  async addVendorsItemAssign(postData) {

    return await db.vendorItemObj.bulkCreate(postData);
  },
  /*getVendorsItemById*/
  async getVendorsItemById(vendorItemId) {
    try {
      let vendors = await db.vendorItemObj.findOne({
        where: { id: vendorItemId },
      });
      return vendors;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  // /*getAllVendorsItem*/
  // async getAllVendorsItem({ page, per_page, search, id, take_all }) {
  //   try {
  //     let whereCondition = {};


  //     if (id) {
  //       whereCondition.vendor_id = id;
  //     }

  //     if (search) {
  //       whereCondition[Op.or] = [
  //         { vendor_item_number: { [Op.iLike]: `%${search}%` } },
  //         { vendor_item_description: { [Op.iLike]: `%${search}%` } },
  //         { currency_code: { [Op.iLike]: `%${search}%` } },
  //         { purchase_uom: { [Op.iLike]: `%${search}%` } },
  //       ];
  //     }


  //     let limit = parseInt(per_page);
  //     let offset = (page - 1) * limit;

  //     if (take_all === "true") {
  //       limit = null;
  //       offset = null;
  //     }

  //     const { rows, count } = await db.vendorItemObj.findAndCountAll({
  //       where: whereCondition,
  //       include: [
  //         {
  //           model: db.itemObj,
  //           as: "item",
  //         },
  //         {
  //           model: db.vendorsObj,
  //           as: "vendors",

  //         }
  //       ],
  //       limit,
  //       offset,
  //       order: [["created_at", "DESC"]],
  //     });

  //     return {
  //       data: rows,
  //       meta: {
  //         total: count,
  //         page: parseInt(page),
  //         per_page: parseInt(per_page),
  //         total_pages: limit ? Math.ceil(count / limit) : 1
  //       }
  //     };
  //   } catch (e) {
  //     logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //     throw e;
  //   }
  // },
  async getAllVendorsItem({ page, per_page, search, id, take_all, warehouse_item_id }) {
    try {
      let whereCondition = {};

      if (warehouse_item_id) {
        whereCondition.warehouse_item_id = warehouse_item_id;
      }

      // ---------- vendor filter (same) ----------
      if (id) {
        whereCondition.vendor_id = id;
      }

      // ---------- search (same) ----------
      if (search) {
        whereCondition[Op.or] = [
          { vendor_item_number: { [Op.iLike]: `%${search}%` } },
          { vendor_item_description: { [Op.iLike]: `%${search}%` } },
          { currency_code: { [Op.iLike]: `%${search}%` } },
          { purchase_uom: { [Op.iLike]: `%${search}%` } },
        ];
      }

      // ---------- pagination setup (same) ----------
      const limit = parseInt(per_page) || 10;
      const currentPage = parseInt(page) || 1;
      const offset = (currentPage - 1) * limit;

      let queryLimit = limit;
      let queryOffset = offset;

      if (take_all === "true") {
        queryLimit = null;
        queryOffset = null;
      }

      // ---------- DB query (same) ----------
      const { rows, count } = await db.vendorItemObj.findAndCountAll({
        where: whereCondition,
        include: [
          {
            model: db.itemObj,
            as: "item",
          },
          {
            model: db.vendorsObj,
            as: "vendors",
          },
        ],
        limit: queryLimit,
        offset: queryOffset,
        order: [["created_at", "DESC"]],
      });

      // ---------- LAZY LOAD META (NEW, SAFE) ----------
      const total = count;
      const current_count = rows.length;
      const loaded_till_now =
        take_all === "true" ? total : offset + current_count;
      const remaining = Math.max(total - loaded_till_now, 0);
      const has_more = loaded_till_now < total;

      return {
        data: rows,
        meta: {
          page: take_all === "true" ? 1 : currentPage,
          limit,
          current_count,
          loaded_till_now,
          remaining,
          total,
          has_more,
        },
      };
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },


  // /*deleteVendorsItem*/
  async deleteVendorsItem(vendorItemIds) {
    try {

      const ids = Array.isArray(vendorItemIds) ? vendorItemIds : [vendorItemIds];

      let deleteVendor = await db.vendorItemObj.destroy({
        where: { id: ids },
      });
      return deleteVendor;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  // // /*updateVendorsItem*/
  async updateVendorsItem(data, vendorItemId) {
    try {
      let vendors = await db.vendorItemObj.update(data, {
        where: { id: vendorItemId },
      });
      return vendors;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  // async getAllActiveUnassignedVendors() 
  //  {

  //   let vendors = await db.vendorsObj.findAll({
  //     where: {
  //       status: "ACTIVE",
  //     },
  //    include: [
  //     {
  //       model: db.vendorItemObj,
  //       as: "vendorAssigns",

  //     },
  //   ],
  //   });

  //   return vendors;
  // }
  // async getAllActiveUnassignedVendors({ search = "", page,per_page }) {
  //   //   return await db.vendorsObj.findAll({
  //   //     where: {
  //   //       status: "ACTIVE",
  //   //       id: {
  //   //         [Op.notIn]: db.dbObj.literal(`
  //   //         (SELECT vendor_id
  //   //          FROM vendor_item
  //   //          WHERE warehouse_item_id IS NOT NULL)
  //   //       `),
  //   //       },
  //   //     },
  //   //   });
  //   const whereCondition = {
  //     status: "ACTIVE",
  //     id: {
  //       [Op.notIn]: db.dbObj.literal(`
  //       (SELECT vendor_id
  //        FROM vendor_item
  //        WHERE warehouse_item_id IS NOT NULL)
  //     `),
  //     },
  //   };

  //   // 🔍 search by vendor name
  //   if (search) {
  //     whereCondition.name = {
  //       [Op.iLike]: `%${search}%`,
  //     };
  //   }

  //   // 💤 lazy load (only limit)
  //   const limit = per_page ? parseInt(per_page) : null;

  //   const vendors = await db.vendorsObj.findAll({
  //     where: whereCondition,
  //     ...(limit ? { limit } : {}),   // ✅ only limit, no offset
  //     order: [["id", "DESC"]],
  //   });

  //   return {
  //     data: vendors,
  //     meta: {
  //       per_page: limit,
  //       current_count: vendors.length,
  //       has_more: limit ? vendors.length === limit : false,
  //     },
  //   };
  // }
  // async getAllActiveUnassignedVendors({ search = "", page = 1, per_page = 10,warehouse_item_id }) {
  //   page = parseInt(page) || 1;
  //   per_page = parseInt(per_page) || 10;

  //   const limit = per_page;
  //   const offset = (page - 1) * limit;

  //   const whereCondition = {
  //     status: "ACTIVE",
  //     id: {
  //       [Op.notIn]: db.dbObj.literal(`
  //       (SELECT vendor_id
  //        FROM vendor_item
  //        WHERE warehouse_item_id IS NOT NULL)
  //     `),
  //     },
  //   };


  //   if (search) {
  //     whereCondition.name = {
  //       [Op.iLike]: `%${search}%`,
  //     };
  //   }


  //   const { rows, count } = await db.vendorsObj.findAndCountAll({
  //     where: whereCondition,
  //     limit,
  //     offset,
  //     order: [["id", "DESC"]],
  //   });


  //   const current_count = rows.length;
  //   const loaded_till_now = offset + current_count;
  //   const remaining = Math.max(count - loaded_till_now, 0);
  //   const has_more = loaded_till_now < count;

  //   return {
  //     data: rows,
  //     meta: {
  //       page,
  //       limit,
  //       current_count,
  //       loaded_till_now,
  //       remaining,
  //       total: count,
  //       has_more,
  //     },
  //   };
  // }
  async getAllActiveUnassignedVendors({
    search = "",
    page = 1,
    per_page = 10,
    warehouse_item_id
  }) {
    page = parseInt(page) || 1;
    per_page = parseInt(per_page) || 10;

    const limit = per_page;
    const offset = (page - 1) * limit;

    const whereCondition = {
      status: "ACTIVE",
      id: {
        [Op.notIn]: db.dbObj.literal(`
        (
          SELECT vendor_id
          FROM vendor_item
          WHERE warehouse_item_id = ${warehouse_item_id}
        )
      `),
      },
    };

    if (search) {
      whereCondition.name = {
        [Op.iLike]: `%${search}%`,
      };
    }

    const { rows, count } = await db.vendorsObj.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["id", "DESC"]],
    });

    const current_count = rows.length;
    const loaded_till_now = offset + current_count;
    const remaining = Math.max(count - loaded_till_now, 0);
    const has_more = loaded_till_now < count;

    return {
      data: rows,
      meta: {
        page,
        limit,
        current_count,
        loaded_till_now,
        remaining,
        total: count,
        has_more,
      },
    };
  },
  async getAvailableVendorItems({
    warehouse_item_id,
    page = 1,
    per_page = 10,
    search = ""
  }) {

    const limit = parseInt(per_page);
    const currentPage = parseInt(page);
    const offset = (currentPage - 1) * limit;

    let whereCondition = {
      id: {
        [Op.notIn]: db.dbObj.literal(`
        (
          SELECT id
          FROM vendor_item
          WHERE warehouse_item_id = ${warehouse_item_id}
        )
      `)
      }
    };

    // optional search
    if (search) {
      whereCondition[Op.or] = [
        { vendor_item_number: { [Op.iLike]: `%${search}%` } },
        { vendor_item_description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { rows, count } = await db.vendorItemObj.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: db.vendorsObj,
          as: "vendors"
        },
        {
          model: db.itemObj,
          as: "item"
        }
      ],
      limit,
      offset,
      order: [["created_at", "DESC"]]
    });

    const current_count = rows.length;
    const loaded_till_now = offset + current_count;
    const remaining = Math.max(count - loaded_till_now, 0);
    const has_more = loaded_till_now < count;

    return {
      data: rows,
      meta: {
        page: currentPage,
        limit,
        current_count,
        loaded_till_now,
        remaining,
        total: count,
        has_more
      }
    };
  },
  async getVendorItemWarehouseSearch(vendor_id, warehouse_id, search) {
    try {

      const assignedItems = await db.vendorItemObj.findAll({
        where: {
          vendor_id: vendor_id,
        },
        raw: true,
      });

      const assignedItemIds = assignedItems.map(item => item.warehouse_item_id);

      let whereCondition = {
        warehouse_id: warehouse_id,
      };

      if (search) {
        whereCondition.sku = {
          [Op.like]: `%${search}%`,
        };
      }

      if (assignedItemIds.length > 0) {
        whereCondition.id = {
          [Op.notIn]: assignedItemIds,
        };
      }

      const data = await db.warehouseItemsObj.findAll({
        where: whereCondition,
        order: [["sku", "ASC"]],

      });

      return data;

    } catch (error) {
      throw error;
    }
  },
  async assignWarehouseItemsToVendor(vendor_id, warehouseItem) {
    try {
     
      console.log('ddddddddddddddddddddd',vendor_id);
      console.log('ddwarehouseItemwarehouseItemddddddddddddddddddd',warehouseItem)
      const warehouseItemIds = warehouseItem.map(
        (item) => item.warehouse_item_id
      );


      const existingItems = await db.vendorItemObj.findAll({
        where: {
          vendor_id: vendor_id,
          warehouse_item_id: warehouseItemIds,
        },
        attributes: ["warehouse_item_id"],
        raw: true,
      });

      const existingIds = existingItems.map(
        (item) => item.warehouse_item_id
      );


      const newItems = warehouseItemIds
        .filter((id) => !existingIds.includes(id))
        .map((id) => ({
          vendor_id: vendor_id,
          warehouse_item_id: id,
        }));


      if (newItems.length > 0) {
        await db.vendorItemObj.bulkCreate(newItems);
      }

      return {
        inserted: newItems.length,
        skipped_existing: existingIds,
      };
    } catch (error) {
      throw error;
    }
  }




};
