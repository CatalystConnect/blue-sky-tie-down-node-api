require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator"); // Updated import
const vendorAddressServices = require("../services/vendorAddress.services");
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});
const { VENDOR_ADDRESS_TYPES } = require("../helper/constant");

module.exports = {
  /*addVendorsAddress*/
  async addVendorsAddress(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      if (!Object.values(VENDOR_ADDRESS_TYPES).includes(req.body.address_type)) {
        return res.status(400).send({
          status: false,
          message:
            "Invalid address_type. Allowed values: MAIN, REMIT_TO, SHIP_FROM, RETURNS",
          data: {},
        });
      }

      const postData = {
        vendor_id: req.body.vendor_id,
        address_type: req.body.address_type,
        is_default: req.body.is_default,
        street_1: req.body.street_1,
        street_2: req.body.street_2,
        state: req.body.state,
        postal_code: req.body.postal_code,
        country_code: req.body.country_code,
      };

      await vendorAddressServices.addVendorsAddress(postData);

      return res
        .status(200)
        .send(commonHelper.parseSuccessRespose({}, "Vendor address added successfully"));
    } catch (error) {
      logger.error(error);
      return res.status(400).json({
        status: false,
        message: error.message || "Add vendor address failed",
        data: {},
      });
    }
  },
  /*getVendorsAddressById*/
  async getVendorsAddressById(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let vendorId = req.query.vendorId;
      let vendor = await vendorAddressServices.getVendorsAddressById(vendorId);
      if (!vendor) {
        throw new Error("Vendor address not found");
      }
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            vendor,
            "Vendor address displayed successfully"
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
  /*getAllVendorsAddress*/
  async getAllVendorsAddress(req, res) {
    try {
      const { page = 1, per_page = 10, search = "", id = "", take_all = "false" } = req.query;

      const vendors = await vendorAddressServices.getAllVendorsAddress({
        page,
        per_page,
        search,
        id,
        take_all
      });

      return res.status(200).send({
        status: true,
        message: "Vendor addresses displayed successfully",
        data: vendors.data,
        meta: vendors.meta
      });

    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Getting vendor addresses failed",
        data: error.response?.data || {},
      });
    }
  },
  /*deleteVendorsAddress*/
  async deleteVendorsAddress(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let vendorId = req.query.vendorId;
      let vendor = await vendorAddressServices.getVendorsAddressById(vendorId);
      if (!vendor) {
        throw new Error("Vendor address not found");
      }
      let deletevendor = await vendorAddressServices.deleteVendorsAddress(vendorId);
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            deletevendor,
            "Vendor address deleted successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Vendor address deletion failed",
        data: error.response?.data || {},
      });
    }
  },
  /*updateVendorsAddress*/
  async updateVendorsAddress(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const vendorAddressId = req.query.vendorId;

      // Check if record exists
      let vendorAddress = await vendorAddressServices.getVendorsAddressById(vendorAddressId);
      if (!vendorAddress) {
        throw new Error("Vendor address not found");
      }

      if (req.body.address_type) {
        if (!Object.values(VENDOR_ADDRESS_TYPES).includes(req.body.address_type)) {
          return res.status(400).send({
            status: false,
            message:
              "Invalid address_type. Allowed values: MAIN, REMIT_TO, SHIP_FROM, RETURNS",
            data: {},
          });
        }
      }

      let data = req.body;

      let postData = {
        vendor_id: data.vendor_id,
        address_type: data.address_type,
        is_default: data.is_default,
        street_1: data.street_1,
        street_2: data.street_2,
        state: data.state,
        postal_code: data.postal_code,
        country_code: data.country_code,
        updated_at: new Date()
      };

      await vendorAddressServices.updateVendorsAddress(postData, vendorAddressId);

      return res.status(200).send(
        commonHelper.parseSuccessRespose("", "Vendor address updated successfully")
      );

    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Vendor address updation failed",
        data: error.response?.data || {},
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
