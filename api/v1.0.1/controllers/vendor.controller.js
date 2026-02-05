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

const { VENDOR_FREIGHT_TERMS, VENDOR_STATUS } = require("../helper/constant");

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
      
      const { user_id, name, email, phone, bill_to, ship_to, vendor_code, dba_name, tax_id, is_1099_eligible, payment_terms_id, incoterm_code, freight_terms, default_shipping_method_id, status } = req.body;

      if (freight_terms && !Object.values(VENDOR_FREIGHT_TERMS).includes(freight_terms)) {
        return res.status(400).send({
          status: false,
          message: `Invalid freight_terms. Allowed: ${Object.values(VENDOR_FREIGHT_TERMS).join(", ")}`,
          data: {},
        });
      }



      if (!Object.values(VENDOR_STATUS).includes(status)) {
        return res.status(400).send({
          status: false,
          message: `Invalid status. Allowed: ${Object.values(VENDOR_STATUS).join(
            ", "
          )}`,
          data: {},
        });
      }
      const postData = {
        // user_id: req.userId,
        // name,
        // email,
        // phone,
        // bill_to,
        // ship_to,
        // vendor_code,
        // dba_name,
        // tax_id,
        // is_1099_eligible,
        // payment_terms_id,
        // incoterm_code,
        // freight_terms,
        // default_shipping_method_id,
        // status,
        user_id: req.userId,
        name,
        vendor_code,
        email,
        phone,
        bill_to,
        ship_to,
        tax_id,
        default_shipping_method_id,
        status,
        dba_name: req.body.dba_name || null,
        is_1099_eligible: req.body.is_1099_eligible || false,
        payment_terms_id: req.body.payment_terms_id || null,
        incoterm_code: req.body.incoterm_code || null,
        freight_terms: req.body.freight_terms || "HARD"
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
      const { page = 1, per_page = "", search = "", limit = "", take_all = "", id = "",status = "" } = req.query;
      let vendors = await vendorServices.getAllVendors({
        page,
        per_page,
        search,
        id,
        take_all,
        limit,
        status
      });
      if (!vendors) {
        throw new Error("Vendor not found");
      }
      return res
        .status(200)
        .send({
          status: true,
          message: "Vendors displayed successfully",
          data: vendors.data,
          meta: vendors.meta
        });
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

       let vendorIds = vendorId
      .split(',')
      .map(id => id.trim())
      .map(id => Number(id))
      .filter(id => !isNaN(id) && Number.isInteger(id) && id > 0);


      let vendor = await vendorServices.getVendorsById(vendorIds);
      if (!vendor) {
        throw new Error("Vendor not found");
      }
      let deletevendor = await vendorServices.deleteVendors(vendorIds);
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

      if (data.status && !Object.values(VENDOR_STATUS).includes(data.status)) {
        return res.status(400).send({
          status: false,
          message: `Invalid status. Allowed: ${Object.values(VENDOR_STATUS).join(
            ", "
          )}`,
          data: {},
        });
      }

      if (data.freight_terms && !Object.values(VENDOR_FREIGHT_TERMS).includes(data.freight_terms)) {
        return res.status(400).send({
          status: false,
          message: `Invalid freight_terms. Allowed: ${Object.values(VENDOR_FREIGHT_TERMS).join(
            ", "
          )}`,
          data: {},
        });
      }

      let postData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        bill_to: data.bill_to,
        ship_to: data.ship_to,
        vendor_code: data.vendor_code,
        dba_name: data.dba_name,
        tax_id: data.tax_id,
        is_1099_eligible: data.is_1099_eligible,
        payment_terms_id: data.payment_terms_id,
        incoterm_code: data.incoterm_code,
        freight_terms: data.freight_terms,
        default_shipping_method_id: data.default_shipping_method_id,
        status: data.status,
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
