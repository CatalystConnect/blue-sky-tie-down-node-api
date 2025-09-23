require("dotenv").config();
const { col } = require("sequelize");
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator");
const tagsServices = require("../services/tags.services");
const ServiceTypeItemServices = require("../services/ServiceTypeItem.services");
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});

module.exports = {
  /*addServiceTypeItem*/
  async addServiceTypeItem(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      function parseInteger(value) {
        return value === "" || value === undefined ? null : parseInt(value, 10);
      }

      function parseDate(value) {
        return !value || isNaN(new Date(value).getTime())
          ? null
          : new Date(value);
      }

      const postData = {
        item_name: req.body.item_name || null,
        zip_code: req.body.zip_code || null,
        service_region: req.body.service_region || null,
        contractor: req.body.contractor || null,
        uom: req.body.uom || null,
        std_cost: parseInteger(req.body.std_cost),
        last_cost: parseInteger(req.body.last_cost),
        average_cost: parseInteger(req.body.average_cost),
        margin: parseInteger(req.body.margin),
        price: parseInteger(req.body.price),
        qty: parseInteger(req.body.qty),
        per: parseInteger(req.body.per),
        tax: parseInteger(req.body.tax),
        lead_time: parseInteger(req.body.lead_time),
        calc_lead_time: parseInteger(req.body.calc_lead_time),
        expiration_date: parseDate(req.body.expiration_date),
        effective_date: parseDate(req.body.effective_date),
        last_sold_date: parseDate(req.body.last_sold_date),
        fut_effective_date: parseDate(req.body.fut_effective_date),
        fut_effective_cost: parseInteger(req.body.fut_effective_cost),
        notes: req.body.notes || null,
        inventory_id: req.body.inventory_id,
        isTax : req.body.isTax,
      };

      const serviceTypeItem = await ServiceTypeItemServices.addServiceTypeItem(
        postData
      );

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            "",
            "Service Type Item  added successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Service Type Itemfailed",
        data: error.response?.data || {},
      });
    }
  },
  async getServiceTypeItemById(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let serviceTypeItemId = req.query.serviceTypeItemId;
      let serviceTypeItem =
        await ServiceTypeItemServices.getServiceTypeItemById(serviceTypeItemId);
      if (!serviceTypeItem) {
        throw new Error("service Type Item  not found");
      }
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            serviceTypeItem,
            "service Type Item   displayed successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error || error.message || "Getting Tag failed",
        data: error.response?.data || {},
      });
    }
  },
  async getAllServiceTypeItems(req, res) {
    try {
      const { page = 1, per_page = 10, search = "" } = req.query;
      let ServiceTypeItem =
        await ServiceTypeItemServices.getAllServiceTypeItems({
          page,
          per_page,
          search,
        });
      if (!ServiceTypeItem) {
        throw new Error("Service Type Item not found");
      }
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            ServiceTypeItem,
            "Service Type Item  displayed successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Getting Service Type Item failed",
        data: error.response?.data || {},
      });
    }
  },
  async deleteServiceTypeItems(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let serviceTypeItemId = req.query.serviceTypeItemId;
      let ServiceTypeItem =
        await ServiceTypeItemServices.getServiceTypeItemById(serviceTypeItemId);
      if (!ServiceTypeItem) {
        throw new Error("Service Type Item  not found");
      }
      let ServiceTypeItems =
        await ServiceTypeItemServices.deleteServiceTypeItems(serviceTypeItemId);
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            ServiceTypeItems,
            "Service Type Items deleted successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Service TypeI tems  deletion failed",
        data: error.response?.data || {},
      });
    }
  },
  async updateServiceTypeItems(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      function parseInteger(value) {
        return value === "" || value === undefined ? null : parseInt(value, 10);
      }

      function parseDate(value) {
        return !value || isNaN(new Date(value).getTime())
          ? null
          : new Date(value);
      }
      let serviceTypeItemId = req.query.serviceTypeItemId;
      let serviceTypeItem =
        await ServiceTypeItemServices.getServiceTypeItemById(serviceTypeItemId);
      if (!serviceTypeItem) {
        throw new Error("service Type Item not found");
      }
      let data = req.body;
      let postData = {
        item_name: req.body.item_name || null,
        zip_code: req.body.zip_code || null,
        service_region: req.body.service_region || null,
        contractor: req.body.contractor || null,
        uom: req.body.uom || null,
        std_cost: parseInteger(req.body.std_cost),
        last_cost: parseInteger(req.body.last_cost),
        average_cost: parseInteger(req.body.average_cost),
        margin: parseInteger(req.body.margin),
        price: parseInteger(req.body.price),
        qty: parseInteger(req.body.qty),
        per: parseInteger(req.body.per),
        tax: parseInteger(req.body.tax),
        lead_time: parseInteger(req.body.lead_time),
        calc_lead_time: parseInteger(req.body.calc_lead_time),
        expiration_date: parseDate(req.body.expiration_date),
        effective_date: parseDate(req.body.effective_date),
        last_sold_date: parseDate(req.body.last_sold_date),
        fut_effective_date: parseDate(req.body.fut_effective_date),
        fut_effective_cost: parseInteger(req.body.fut_effective_cost),
        notes: req.body.notes || null,
        inventory_id: req.body.inventory_id,
        isTax : req.body.isTax,
      };

      let updateServiceType =
        await ServiceTypeItemServices.updateServiceTypeItems(
          postData,
          serviceTypeItemId
        );
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            updateServiceType,
            "update Service Type updated successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "update Service Type  updation failed",
        data: error.response?.data || {},
      });
    }
  },

  async getAllServiceTypeById(req, res) {
    try {
      const { itemId } = req.query;
  
      const serviceTypeItem = await ServiceTypeItemServices.getAllServiceTypeById({
        itemId,
      });
  
      if (!serviceTypeItem) {
        return res.status(404).json({
          status: false,
          message: "Service Type Item not found",
          data: {},
        });
      }
  
      return res.status(200).json(
        commonHelper.parseSuccessRespose(
          serviceTypeItem,
          "Service Type Item displayed successfully"
        )
      );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Getting Service Type Item failed",
        data: error.response?.data || {},
      });
    }
  },

  async importServiceTypeItem(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const result = await ServiceTypeItemServices.importServiceTypeItem(req.file.path);

      return res.json({
        message: "Service Type Item Services Import completed",
        ...result,
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Import failed",
        error: error.message,
        stack: error.stack,
      });
    }
  },
  
};
