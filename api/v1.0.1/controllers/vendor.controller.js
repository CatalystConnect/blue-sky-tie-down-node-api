require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator"); // Updated import
const unitsServices = require("../services/units.services");
const vendorServices = require("../services/vendor.services");
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});

module.exports = {
  /*addVendors*/
  async addVendors(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const { user_id, name, email, phone, bill_to, ship_to } = req.body;

      const postData = {
        user_id: req.userId,
        name,
        email,
        phone,
        bill_to,
        ship_to,
      };

      const vendor = await vendorServices.addVendors(postData);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose("", "Vendor added successfully")
        );
    } catch (error) {
      logger.error(error);
      return res.status(400).json({
        status: false,
        message: error.message || "Add vendor failed",
        data: {},
      });
    }
  },
  /*getVendorsById*/
  async getVendorsById(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let vendorId = req.query.vendorId;
      let vendor = await vendorServices.getVendorsById(vendorId);
      if (!vendor) {
        throw new Error("Vendor not found");
      }
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            vendor,
            "Vendor displayed successfully"
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
  /*getAllVendors*/
  async getAllVendors(req, res) {
    try {
      const { page = 1, per_page = 5, search = "", limit="" ,take_all="", id = "" } = req.query;
      let vendors = await vendorServices.getAllVendors({
        page,
        per_page,
        search,
        id,
        take_all,
        limit
      });
      if (!vendors) {
        throw new Error("Vendor not found");
      }
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            vendors,
            "Vendors displayed successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Getting Vendors failed",
        data: error.response?.data || {},
      });
    }
  },
  /*deleteVendors*/
  async deleteVendors(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let vendorId = req.query.vendorId;
      let vendor = await vendorServices.getVendorsById(vendorId);
      if (!vendor) {
        throw new Error("Vendor not found");
      }
      let deletevendor = await vendorServices.deleteVendors(vendorId);
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            deletevendor,
            "Vendor deleted successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Vendor deletion failed",
        data: error.response?.data || {},
      });
    }
  },
  /*updateVendors*/
  async updateVendors(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let vendorId = req.query.vendorId;
      let vendor = await vendorServices.getVendorsById(vendorId);
      if (!vendor) {
        throw new Error("Vendor not found");
      }
      let data = req.body;
      let postData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        bill_to: data.bill_to,
        ship_to: data.ship_to,
        updated_at: new Date(),
      };

      let updateVendor = await vendorServices.updateVendors(postData, vendorId);
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose("", "Vendor updated successfully")
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Vendor updation failed",
        data: error.response?.data || {},
      });
    }
  },

  validate(method) {
    switch (method) {
      case "addVendors": {
        return [check("name").notEmpty().withMessage("Name is Required")];
      }
      case "updateVendors": {
        return [check("name").notEmpty().withMessage("Name is Required")];
      }
    }
  },
};
