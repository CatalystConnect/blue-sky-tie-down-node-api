require("dotenv").config();
const { col } = require("sequelize");
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator");
const itemServices = require("../services/item.services");
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});
const db = require("../models");

module.exports = {
  /*addItems*/
  async addItems(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const postData = {
        user_id: req.userId,
        sku: req.body.sku,
        short_description: req.body.short_description,
        description: req.body.description,
        website_id: req.body.website_id,
        freeform: req.body.freeform,
        meta: req.body.meta,
        title_tag: req.body.title_tag,
        meta_description: req.body.meta_description,
        status: req.body.status,
        service: req.body.service,
        brand_id:
          req.body.brand_id && !isNaN(req.body.brand_id)
            ? parseInt(req.body.brand_id)
            : null,
        image: req.files?.image?.[0]
          ? `files/${req.files.image[0].filename}`
          : null,
      };
      const normalizeInt = (val) => {
        return val !== undefined && val !== null && val !== "" && !isNaN(val)
          ? parseInt(val)
          : null;
      };

      const item = await itemServices.addItems(postData);

      if (postData.brand_id) {
        let data = {
          item_id: item.id,
          brand_id: postData.brand_id,
        };
        await itemServices.itemBrand(data);
      }

      if (req.body.itemCategories && Array.isArray(req.body.itemCategories)) {
        const categoryData = req.body.itemCategories.map((categoryId) => ({
          item_id: item.id,
          product_category_id: parseInt(categoryId) || null,
        }));

        await itemServices.ItemProductCategory(categoryData);
      }

      if (req.body.itemTag && Array.isArray(req.body.itemTag)) {
        const tagData = req.body.itemTag.map((tagId) => ({
          item_id: item.id,
          product_tag_id: parseInt(tagId) || null,
        }));

        await itemServices.ItemTag(tagData);
      }

      if (req.body.itemUnits && Array.isArray(req.body.itemUnits)) {
        const unitData = req.body.itemUnits.map((unit) => ({
          item_id: item.id,
          unit_id: unit.unit_id,
          qty: unit.qty,
          per_unit_id: normalizeInt(unit.per_unit_id),
          price: unit.price,
          upc: unit.upc,
          height: unit.height || null,
          weight: unit.weight || null,
          length: unit.length || null,
          width: unit.width || null,
          unit_type: unit.unit_type || null,
          isDefault: unit.isDefault || null,
          isBase: unit.isBase || null,
          // conversionMatrix: unit.conversionMatrix || null
          conversionMatrix: unit.conversionMatrix
            ? typeof unit.conversionMatrix === "string"
              ? JSON.parse(unit.conversionMatrix)
              : unit.conversionMatrix
            : {},
        }));

        await itemServices.ItemUnits(unitData);
      }

      if (req.body.itemVendors && Array.isArray(req.body.itemVendors)) {
        const vendorData = req.body.itemVendors
          // 1. filter out completely empty rows
          .filter((vendor) =>
            Object.values(vendor).some(
              (val) => val && String(val).trim() !== ""
            )
          )
          // 2. sanitize/map valid ones
          .map((vendor) => ({
            item_id: item.id ? parseInt(item.id, 10) : null, // required
            vendor_id:
              vendor.vendor_id &&
              String(vendor.vendor_id).trim() !== "" &&
              !isNaN(vendor.vendor_id)
                ? parseInt(vendor.vendor_id, 10)
                : null,
            item:
              vendor.item && String(vendor.item).trim() !== ""
                ? vendor.item.trim()
                : null,
            cost:
              vendor.cost && !isNaN(vendor.cost)
                ? parseFloat(vendor.cost)
                : null,
            uom:
              vendor.uom && !isNaN(vendor.uom)
                ? parseInt(vendor.uom, 10)
                : null,
            cost_per_each:
              vendor.cost_per_each && !isNaN(vendor.cost_per_each)
                ? parseFloat(vendor.cost_per_each)
                : null,
            comment:
              vendor.comment && String(vendor.comment).trim() !== ""
                ? vendor.comment.trim()
                : null,
            is_stocked:
              vendor.is_stocked &&
              (vendor.is_stocked.trim() === "1" ||
                vendor.is_stocked.trim().toLowerCase() === "true")
                ? 1
                : 0, // ✅ default to 0 instead of null
            unit_id:
              vendor.unit_id && !isNaN(vendor.unit_id)
                ? parseInt(vendor.unit_id, 10)
                : null,
          }));

        if (vendorData.length) {
          await itemServices.ItemVendors(vendorData);
        }
      }

      if (req.body.itemWebs && Array.isArray(req.body.itemWebs)) {
        const webData = req.body.itemWebs.map((web) => ({
          item_id: item.id,
          category: web.category || null,
          description: web.description || null,
          sequence: web.sequence || null,
        }));

        await itemServices.ItemWebs(webData);
      }

      const uploadedFiles = Object.keys(req.files)
        .filter((key) => key.startsWith("itemImages"))
        .flatMap((key) => req.files[key]); // flatten arrays

      if (uploadedFiles.length) {
        const imageData = uploadedFiles.map((file) => ({
          item_id: item.id,
          user_id: req.userId,
          file: `files/${file.filename}`,
          file_name: file.originalname,
        }));

        await itemServices.ItemImages(imageData);
      }
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(item, "Item  added successfully")
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.response?.data?.error || error.message || "Item failed",
        data: error.response?.data || {},
      });
    }
  },

  /*getAllItems*/
  async getAllItems(req, res) {
    try {
      const {
        page = 1,
        per_page = 10,
        search = "",
        limit = "",
        take_all = "",
        id = [],
        per_id = [],
        type = "",
      } = req.query;

      let items = await itemServices.getAllItems({
        page,
        per_page,
        search,
        limit,
        take_all,
        id,
        per_id,
        type,
      });

      if (!items) {
        throw new Error("Items not found");
      }

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            items,
            "Items displayed successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Getting Items failed",
        data: error.response?.data || {},
      });
    }
  },
  /*getItemsById*/
  async getItemsById(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let itemId = req.query.itemId;
      let item = await itemServices.getItemsById(itemId);
      if (!item) {
        throw new Error("Item  not found");
      }

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(item, "Item  displayed successfully")
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error || error.message || "Getting Item failed",
        data: error.response?.data || {},
      });
    }
  },
  /*deleteItems*/
  async deleteItems(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let itemId = req.query.itemId;
      let item = await itemServices.getItemsById(itemId);
      if (!item) {
        throw new Error("Item  not found");
      }
      let items = await itemServices.deleteItems(itemId);
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(items, "Item deleted successfully")
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Item  deletion failed",
        data: error.response?.data || {},
      });
    }
  },

  /* updateItems */
  async updateItems(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const itemId = req.query.itemId;
      const item = await itemServices.getItemsById(itemId);
      if (!item) {
        throw new Error("Item not found");
      }

      const postData = {
        user_id: req.userId,
        sku: req.body.sku,
        short_description: req.body.short_description,
        description: req.body.description,
        website_id: req.body.website_id,
        freeform: req.body.freeform,
        meta: req.body.meta,
        title_tag: req.body.title_tag,
        meta_description: req.body.meta_description,
        status: req.body.status,
        service: req.body.service,
        brand_id:
          req.body.brand_id && !isNaN(req.body.brand_id)
            ? parseInt(req.body.brand_id)
            : null,
        image: req.files?.image?.[0]
          ? `files/${req.files.image[0].filename}`
          : null,
      };

      if (req.file) {
        postData.image = req.file.filename;
      }

      await itemServices.updateItems(postData, itemId);

      const normalizeInt = (val) => {
        return val !== undefined && val !== null && val !== "" && !isNaN(val)
          ? parseInt(val)
          : null;
      };

      if (postData.brand_id) {
        let data = {
          item_id: itemId,
          brand_id: postData.brand_id,
        };
        await itemServices.itemBrand(data);
      }

      if (req.body.itemCategories && Array.isArray(req.body.itemCategories)) {
        const categoryData = req.body.itemCategories.map((categoryId) => ({
          item_id: itemId,
          product_category_id: normalizeInt(categoryId),
        }));

        await itemServices.ItemProductCategory(categoryData);
      }

      if (req.body.itemTag && Array.isArray(req.body.itemTag)) {
        const tagData = req.body.itemTag.map((tagId) => ({
          item_id: itemId,
          product_tag_id: normalizeInt(tagId),
        }));

        await itemServices.ItemTag(tagData);
      }

      if (req.body.itemUnits && Array.isArray(req.body.itemUnits)) {
        const unitData = req.body.itemUnits.map((unit) => ({
          item_id: itemId,
          unit_id: unit.unit_id,
          qty: unit.qty,
          per_unit_id: normalizeInt(unit.per_unit_id),
          price: unit.price,
          upc: unit.upc,
          height: unit.height || null,
          weight: unit.weight || null,
          length: unit.length || null,
          width: unit.width || null,
          unit_type: unit.unit_type || null,
          isDefault: unit.isDefault || null,
          isBase: unit.isBase || null,
          conversionMatrix: unit.conversionMatrix
            ? typeof unit.conversionMatrix === "string"
              ? JSON.parse(unit.conversionMatrix)
              : unit.conversionMatrix
            : {},
        }));

        await itemServices.ItemUnits(unitData);
      }

      if (req.body.itemVendors && Array.isArray(req.body.itemVendors)) {
        const vendorData = req.body.itemVendors.map((vendor) => ({
          item_id: itemId,
          vendor_id: vendor.vendor_id || null,
          item: vendor.item || null,
          cost: vendor.cost || null,
          uom: vendor.uom || null,
          cost_per_each: vendor.cost_per_each || null,
          comment: vendor.comment || null,
          is_stocked: vendor.is_stocked || "0",
          unit_id: normalizeInt(vendor.unit_id) || null,
        }));

        await itemServices.ItemVendors(vendorData);
      }

      if (req.body.itemWebs && Array.isArray(req.body.itemWebs)) {
        const webData = req.body.itemWebs.map((web) => ({
          item_id: itemId,
          category: web.category || null,
          description: web.description || null,
          sequence: normalizeInt(web.sequence) || null,
        }));

        await itemServices.ItemWebs(webData);
      }
      if (req.body.deletedItemImage) {
        let ids = req.body.deletedItemImage;

        if (typeof ids === "string") {
          try {
            ids = JSON.parse(ids);
          } catch (e) {
            ids = [ids];
          }
        }

        if (!Array.isArray(ids)) {
          ids = [ids];
        }

        await db.itemImagesObj.destroy({
          where: { id: ids },
        });
      }

      const uploadedFiles = Object.keys(req.files)
        .filter((key) => key.startsWith("itemImages"))
        .flatMap((key) => req.files[key]);

      if (uploadedFiles.length) {
        const imageData = uploadedFiles.map((file) => ({
          item_id: item.id,
          user_id: req.userId,
          file: `files/${file.filename}`,
          file_name: file.originalname,
        }));

        await itemServices.ItemImages(imageData);
      }

      const updatedItem = await itemServices.getItemsById(itemId);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            updatedItem,
            "Item updated successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Item updation failed",
        data: error.response?.data || {},
      });
    }
  },
};
