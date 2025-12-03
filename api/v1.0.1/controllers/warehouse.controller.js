require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const xlsx = require("xlsx");
var bcrypt = require("bcryptjs");
const wareHouseServices = require("../services/wareHouse.services");
var jwt = require("jsonwebtoken");
const config = require("../../../config/db.config");
const { check, validationResult } = require("express-validator"); // Updated import
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});
const db = require("../models");
const warehouseQueue = require("../../../queues/warehouseQueue");
module.exports = {
  /*addWareHouse*/
  async addWareHouse(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let data = req.body;

      let postData = {
        user_id: req.userId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
      };
      const newWarehouse = await wareHouseServices.addWareHouse(postData);

      await warehouseQueue.add("assignAllActiveItems", {
        warehouseId: newWarehouse.id,
      })
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose("", "WareHouse add successfully")
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Adding WareHouse failed",
        data: error.response?.data || {},
      });
    }
  },

  /*getAllWareHouse*/
  async getAllWareHouse(req, res) {
    try {
      const {
        page = 1,
        per_page = 10,
        search = "",
        limit = "",
        take_all = "",
        id = "",
      } = req.query;

      const getAllWareHouse = await wareHouseServices.getAllWareHouse({
        page,
        per_page,
        search,
        limit,
        take_all,
        id,
      });

      if (!getAllWareHouse) {
        throw new Error("get all ware house not found");
      }

      return res.status(200).send({
        status: true,
        message: "All warehouses displayed successfully",
        data: getAllWareHouse.data,
        meta: getAllWareHouse.meta,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Getting all ware house failed",
        data: error.response?.data || {},
      });
    }
  },

  // /*updateContract*/
  async updateWareHouse(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const wareHouseId = req.query.id || req.params.id; // support both query & params
      const updatedData = req.body;

      if (!wareHouseId) {
        return res.status(400).json({
          status: false,
          message: "WareHouse ID is required",
        });
      }

      const wareHouse = await wareHouseServices.updateWareHouse(
        wareHouseId,
        updatedData
      );

      if (!wareHouse) {
        return res.status(404).json({
          status: false,
          message: "WareHouse not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "WareHouse updated successfully",
        data: wareHouse,
      });
    } catch (err) {
      console.error("Update WareHouse Error:", err.message);
      return res.status(500).json({
        status: false,
        message: "Failed to update WareHouse",
        error: err.message,
      });
    }
  },
  //   // Delete WareHouse
  async deleteWareHouse(req, res) {
    try {
      const wareHouseId = req.query.id || req.params.id;

      if (!wareHouseId) {
        return res.status(400).json({
          status: false,
          message: "WareHouse ID is required",
        });
      }

      const deleted = await wareHouseServices.deleteWareHouse(wareHouseId);

      if (!deleted) {
        return res.status(404).json({
          status: false,
          message: "WareHouse not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "WareHouse deleted successfully",
      });
    } catch (err) {
      console.error("Delete WareHouse Error:", err.message);
      return res.status(500).json({
        status: false,
        message: "Failed to delete WareHouse",
        error: err.message,
      });
    }
  },
  // Get WareHouse by ID
  async getWareHouseById(req, res) {
    try {
      const wareHouseId = req.query.id || req.params.id;

      if (!wareHouseId) {
        return res.status(400).json({
          status: false,
          message: "WareHouse ID is required",
        });
      }

      const wareHouse = await wareHouseServices.getWareHouseById(wareHouseId);

      if (!wareHouse) {
        return res.status(404).json({
          status: false,
          message: "WareHouse not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "WareHouse fetched successfully",
        data: wareHouse,
      });
    } catch (err) {
      console.error("Get WareHouse Error:", err.message);
      return res.status(500).json({
        status: false,
        message: "Failed to fetch WareHouse",
        error: err.message,
      });
    }
  },

  validate(method) {
    switch (method) {
      case "addWareHouse": {
        return [
          check("name").notEmpty().withMessage("WareHouse name is required"),
        ];
      }
      case "updateWareHouse": {
        return [
          check("name").notEmpty().withMessage("WareHouse name is required"),
        ];
      }
    }
  },
};
