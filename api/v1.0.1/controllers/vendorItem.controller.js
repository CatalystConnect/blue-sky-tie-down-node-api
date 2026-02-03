require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator"); // Updated import
const vendorContactServices = require("../services/vendorContact.services");
const vendorItemServices = require("../services/vendorItem.services");
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});


module.exports = {
  /*addVendorsItem*/
  async addVendorsItem(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }


      const data = req.body;

      const postData = {
        vendor_id: data.vendor_id,
        item_id: data.item_id,
        vendor_part_number: data.vendor_part_number || null,
        vendor_description: data.vendor_description || null,
        default_unit_cost: data.default_unit_cost || null,
        currency_code: data.currency_code || null,
        purchase_uom: data.purchase_uom || null,
        lead_time_days: data.lead_time_days || null,
        min_order_qty: data.min_order_qty || null,
        future_effective_date: data.future_effective_date || null,
        order_multiple_qty: data.order_multiple_qty || null,
        standard_lead_time_days: data.standard_lead_time_days || null,
        is_preferred_vendor: data.is_preferred_vendor || null,
        ranking: data.ranking || null,
        is_active: data.is_active ?? true,
        buyer: data.buyer || null,
        buyer_type: data.buyer_type || null,
        seasonal_adj: data.seasonal_adj || null,

        cost_per: data.cost_per || null,
        cost_uom: data.cost_uom || null,

        fut_std: data.fut_std || null,
        fut_effective: data.fut_effective || null,

        last_warning_date: data.last_warning_date || null,
        calendar_year_hits: data.calendar_year_hits || null,
        last_12_month_hits: data.last_12_month_hits || null,
        average_lead_time: data.average_lead_time || null,
        average_cost: data.average_cost || null,
        average_land_cost: data.average_land_cost || null,
        last_cost: data.last_cost || null,
        last_land_cost: data.last_land_cost || null,


      };

      await vendorItemServices.addVendorsItem(postData);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            {},
            "Vendor item added successfully"
          )
        );
    } catch (error) {
      logger.error(error);
      return res.status(400).json({
        status: false,
        message: error.message || "Add vendor item failed",
        data: {},
      });
    }
  },
  /*getVendorsItemById*/
  async getVendorsItemById(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let vendorItemId = req.query.vendorItemId;
      let vendor = await vendorItemServices.getVendorsItemById(vendorItemId);
      if (!vendor) {
        throw new Error("Vendor item not found");
      }
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            vendor,
            "Vendor item displayed successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Getting vendor failed",
        data: error.response?.data || {},
      });
    }
  },
  /*getAllVendorsItem*/
  async getAllVendorsItem(req, res) {
    try {
      const { page = 1, per_page = 10, search = "", id = "", take_all = "false" } = req.query;

      const vendors = await vendorItemServices.getAllVendorsItem({
        page,
        per_page,
        search,
        id,
        take_all
      });

      return res.status(200).send({
        status: true,
        message: "Vendor items displayed successfully",
        data: vendors.data,
        meta: vendors.meta
      });

    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Getting vendor items failed",
        data: error.response?.data || {},
      });
    }
  },
  /*deleteVendorsItem*/
  async deleteVendorsItem(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let vendorItemId = req.query.vendorItemId;

      let vendorItemIds = vendorItemId
        .split(',')
        .map(id => id.trim())
        .map(id => Number(id))
        .filter(id => !isNaN(id) && Number.isInteger(id) && id > 0);


      let vendor = await vendorItemServices.getVendorsItemById(vendorItemIds);
      if (!vendor) {
        throw new Error("Vendor item not found");
      }
      let deletevendor = await vendorItemServices.deleteVendorsItem(vendorItemIds);
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            deletevendor,
            "Vendor item deleted successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Vendor item deletion failed",
        data: error.response?.data || {},
      });
    }
  },
  /*updateVendorsItem*/
  async updateVendorsItem(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const vendorItemId = req.query.vendorItemId;

      // Check if record exists
      let vendorItem = await vendorItemServices.getVendorsItemById(vendorItemId);
      if (!vendorItem) {
        throw new Error("Vendor item not found");
      }


      let data = req.body;

      let postData = {
        vendor_id: data.vendor_id,
        item_id: data.item_id,
        vendor_part_number: data.vendor_part_number || null,
        vendor_description: data.vendor_description || null,
        default_unit_cost: data.default_unit_cost || null,
        currency_code: data.currency_code || null,
        purchase_uom: data.purchase_uom || null,
        lead_time_days: data.lead_time_days || null,
        min_order_qty: data.min_order_qty || null,
        future_effective_date: data.future_effective_date || null,
        order_multiple_qty: data.order_multiple_qty || null,
        standard_lead_time_days: data.standard_lead_time_days || null,
        is_preferred_vendor: data.is_preferred_vendor ?? false,
        ranking: data.ranking || null,
        is_active: data.is_active || true,
        buyer: data.buyer || null,
        buyer_type: data.buyer_type || null,
        seasonal_adj: data.seasonal_adj || null,

        cost_per: data.cost_per || null,
        cost_uom: data.cost_uom || null,

        fut_std: data.fut_std || null,
        fut_effective: data.fut_effective || null,

        last_warning_date: data.last_warning_date || null,
        calendar_year_hits: data.calendar_year_hits || null,
        last_12_month_hits: data.last_12_month_hits || null,
        average_lead_time: data.average_lead_time || null,
        average_cost: data.average_cost || null,
        average_land_cost: data.average_land_cost || null,
        last_cost: data.last_cost || null,
        last_land_cost: data.last_land_cost || null,


      };

      await vendorItemServices.updateVendorsItem(postData, vendorItemId);
      return res.status(200).send(
        commonHelper.parseSuccessRespose("", "Vendor item updated successfully")
      );

    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Vendor item update failed",
        data: error.response?.data || {},
      });
    }
  },

  async getAllVendorsWarehouse(req, res) {
    try {

      const result = await vendorItemServices.getAllActiveUnassignedVendors();



      return res.status(200).send(
        commonHelper.parseSuccessRespose(
          result,
          "Active vendors fetched successfully"
        )
      );
    } catch (error) {
      console.error(error);
      return res.status(500).send(
        commonHelper.parseErrorResponse(
          error,
          "Failed to fetch vendors"
        )
      );
    }
  },
  async assignVendorsItem(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const { warehouse_item_id, vendors } = req.body;

      if (!Array.isArray(vendors) || vendors.length === 0) {
        return res.status(400).send(commonHelper.parseErrorRespose({ vendors: "No vendors selected" }));
      }

      const postData = vendors.map(v => ({
        vendor_id: v.vendor_id,
        item_id: v.item_id,
        warehouse_item_id,
        default_vendor: false
      }));

      await vendorItemServices.addVendorsItemAssign(postData);

      return res.status(200).send(
        commonHelper.parseSuccessRespose({}, "Vendors assigned successfully")
      );

    } catch (error) {
      logger.error(error);
      return res.status(400).json({
        status: false,
        message: error.message || "Add vendor item failed",
        data: {},
      });
    }
  },

  // validate(method) {
  //   switch (method) {
  //     case "addVendors": {
  //       return [check("name").notEmpty().withMessage("Name is Required")];
  //     }
  //     case "updateVendors": {
  //       return [check("name").notEmpty().withMessage("Name is Required")];
  //     }
  //   }
  // },
};
