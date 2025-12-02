var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op,fn, col, where } = require("sequelize");

module.exports = {
  /*addItems*/
  async addItems(postData) {
    try {
      const item = await db.itemObj.create(postData);
      return item;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*getAllItems*/
  // async getAllItems({ page, per_page, search }) {
  //     try {
  //         const limit = parseInt(per_page);
  //         const offset = (page - 1) * limit;

  //         let whereCondition = {};
  //         if (search) {
  //             whereCondition[Op.or] = [
  //                 { sku: { [Op.like]: `%${search}%` } },
  //                 { short_description: { [Op.like]: `%${search}%` } },
  //                 { description: { [Op.like]: `%${search}%` } },
  //                 { title_tag: { [Op.like]: `%${search}%` } },
  //                 { meta: { [Op.like]: `%${search}%` } },
  //                 { website_id: { [Op.like]: `%${search}%` } },
  //                 { freeform: { [Op.like]: `%${search}%` } }
  //             ];
  //         }

  //         const { rows, count } = await db.itemObj.findAndCountAll({
  //             where: whereCondition,
  //             limit,
  //             offset,
  //             order: [["created_at", "DESC"]],
  //         });

  //         return {
  //             total: count,
  //             page: parseInt(page),
  //             per_page: limit,
  //             totalPages: Math.ceil(count / limit),
  //             items: rows,
  //         };
  //     } catch (e) {
  //         logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //         throw e;
  //     }
  // },
  //   async getAllItems({ page, per_page, search, limit, take_all, id, per_id }) {
  //     try {
  //       page = parseInt(page) || 1;
  //       per_page = parseInt(per_page) || 10;

  //       const _limit = per_page;
  //       const offset = (page - 1) * _limit;

  //       let whereCondition = {};

  //       // search condition
  //       if (search) {
  //         whereCondition[Op.or] = [
  //           { sku: { [Op.like]: `%${search}%` } },
  //           { short_description: { [Op.like]: `%${search}%` } },
  //           { description: { [Op.like]: `%${search}%` } },
  //           { title_tag: { [Op.like]: `%${search}%` } },
  //           { meta: { [Op.like]: `%${search}%` } },
  //           { website_id: { [Op.like]: `%${search}%` } },
  //           { freeform: { [Op.like]: `%${search}%` } },
  //         ];
  //       }

  //       // handle id filter (id + per_id both go on column "id")
  //       let ids = [];

  //       // collect ids from query
  //       if (Array.isArray(id)) {
  //         ids = ids.concat(id.map((v) => parseInt(v)).filter((v) => !isNaN(v)));
  //       } else if (id) {
  //         ids.push(parseInt(id));
  //       }

  //       // collect per_ids from query (also treated as id filter)
  //       if (Array.isArray(per_id)) {
  //         ids = ids.concat(
  //           per_id.map((v) => parseInt(v)).filter((v) => !isNaN(v))
  //         );
  //       } else if (per_id) {
  //         ids.push(parseInt(per_id));
  //       }
  // console.log('=>>>>>>>>>>>>>>>>>',ids);
  //       if (ids.length > 0) {
  //         whereCondition.id = { [Op.in]: ids };
  //       }

  //       let queryOptions = {
  //         where: whereCondition,
  //         order: [["created_at", "DESC"]],
  //       };

  //       // pagination or fetch all
  //       if (take_all && take_all === "all") {
  //         queryOptions.limit = null;
  //         queryOptions.offset = null;
  //       } else {
  //         queryOptions.limit = _limit;
  //         queryOptions.offset = offset;
  //       }

  //       const { rows, count } = await db.itemObj.findAndCountAll(queryOptions);

  //       return {
  //         total: count,
  //         page,
  //         per_page: _limit,
  //         totalPages: Math.ceil(count / _limit),
  //         items: rows,
  //       };
  //     } catch (e) {
  //       logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //       throw e;
  //     }
  //   },

  async getAllItems({
    page,
    per_page,
    search,
    limit,
    take_all,
    id,
    per_id,
    type,
  }) {
    try {
      page = parseInt(page) || 1;

      // prefer explicit "limit" if passed, otherwise use per_page
      per_page = parseInt(limit) || parseInt(per_page) || 10;

      const _limit = per_page;
      const offset = (page - 1) * _limit;

      let whereCondition = {};

      // search condition
      if (search) {
        whereCondition[Op.or] = [
          where(fn("LOWER", col("sku")), {
            [Op.like]: `%${search.toLowerCase()}%`,
          }),
        ];
      }

      // handle id + per_id filters
      let ids = [];

      const collectIds = (value) => {
        if (Array.isArray(value)) {
          return value.map((v) => parseInt(v)).filter((v) => !isNaN(v)); // remove empty & NaN
        } else if (value) {
          let num = parseInt(value);
          return !isNaN(num) ? [num] : [];
        }
        return [];
      };

      ids = [...collectIds(id), ...collectIds(per_id)];

      if (ids.length > 0) {
        whereCondition.id = { [Op.in]: ids };
      }

      // if (type) {
      //   if (type === "service") whereCondition.service = "service";
      //   else if (type === "physical") whereCondition.service = "physical";
      // }

      let queryOptions = {
        where: whereCondition,
        order: [["created_at", "DESC"]],
      };

      // pagination or fetch all
      if (take_all && take_all === "all") {
        queryOptions.limit = null;
        queryOptions.offset = null;
      } else {
        queryOptions.limit = _limit;
        queryOptions.offset = offset;
      }

      const { rows, count } = await db.itemObj.findAndCountAll({
        ...queryOptions, 
        include: [
           { model: db.itemUnitsObj, as: "item_units" },
           { model: db.brandObj, as: 'brand' }

        ],
      });
      

      return {
        total: count,
        page,
        per_page: _limit,
        totalPages: Math.ceil(count / _limit),
        items: rows,
      };
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*getItemsById*/
  async getItemsById(itemId) {
    try {
      const item = await db.itemObj.findOne({
        where: { id: itemId },
        include: [
          { model: db.brandObj, as: "brand" },
          // { model: db.itemTagObj, as: "item_tags" },
          // { model: db.itemCategoriesObj, as: "item_categories" },
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
          // { model: db.itemVendorObj, as: "item_vendors" },
          // { model: db.itemWebsObj, as: "item_webs" },
          // { model: db.itemImagesObj, as: "item_images" },
          // { model: db.serviceTypeitemsObj, as: "serviceItems" },
        ],
        order: [
          // [{ model: db.itemImagesObj, as: "item_images" }, "id", "ASC"],
          [{ model: db.itemUnitsObj, as: "item_units" }, "id", "ASC"],
          // [{ model: db.itemVendorObj, as: "item_vendors" }, "id", "ASC"],
          // [{ model: db.itemWebsObj, as: "item_webs" }, "id", "ASC"],
          // [{ model: db.itemCategoriesObj, as: "item_categories" }, "id", "ASC"],
          // [{ model: db.itemTagObj, as: "item_tags" }, "id", "ASC"],
        ],
      });
      return item;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  /*deleteItems*/
  async deleteItems(itemId) {
    try {
      let deleteItem = await db.itemObj.destroy({
        where: { id: itemId },
      });
      return deleteItem;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  /*updateItems*/
  async updateItems(data, itemId) {
    try {
      await db.itemObj.update(data, {
        where: { id: itemId },
      });

      const updatedItem = await db.itemObj.findOne({
        where: { id: itemId },
        raw: true,
      });

      return updatedItem;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  async itemBrand(data) {
    try {
      await db.brandItemObj.destroy({ where: { item_id: data.item_id } });

      const brandItem = await db.brandItemObj.create({
        item_id: data.item_id,
        brand_id: data.brand_id,
      });
      return brandItem;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  async ItemProductCategory(categoryData) {
    try {
      const itemId = categoryData[0]?.item_id;

      await db.itemCategoriesObj.destroy({
        where: { item_id: itemId },
      });

      return await db.itemCategoriesObj.bulkCreate(categoryData);
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  async ItemTag(tagData) {
    try {
      const itemId = tagData[0]?.item_id;

      await db.itemTagObj.destroy({
        where: { item_id: itemId },
      });

      const tags = await db.itemTagObj.bulkCreate(tagData);
      return tags;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  async ItemUnits(unitDataArray) {
    try {
      if (!unitDataArray || !unitDataArray.length) return [];

      const itemId = unitDataArray[0]?.item_id;

      await db.itemUnitsObj.destroy({
        where: { item_id: itemId },
      });

      const insertedUnits = await db.itemUnitsObj.bulkCreate(unitDataArray);

      return insertedUnits;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  async ItemVendors(vendorDataArray) {
    try {
      if (!vendorDataArray || !vendorDataArray.length) return [];

      const itemId = vendorDataArray[0]?.item_id;

      await db.itemVendorObj.destroy({
        where: { item_id: itemId },
      });

      const insertedVendors = await db.itemVendorObj.bulkCreate(
        vendorDataArray
      );

      return insertedVendors;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  async ItemWebs(webDataArray) {
    try {
      if (!webDataArray || !webDataArray.length) return [];

      const itemId = webDataArray[0]?.item_id;

      await db.itemWebsObj.destroy({
        where: { item_id: itemId },
      });

      const insertedWebs = await db.itemWebsObj.bulkCreate(webDataArray);

      return insertedWebs;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  async ItemImages(imageDataArray) {
    try {
      if (!imageDataArray || !imageDataArray.length) return [];

      // const itemId = imageDataArray[0]?.item_id;

      // await db.itemImagesObj.destroy({
      //   where: { item_id: itemId },
      // });

      const insertedImages = await db.itemImagesObj.bulkCreate(imageDataArray);

      return insertedImages;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
};
