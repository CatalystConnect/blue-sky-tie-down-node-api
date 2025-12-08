require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator"); // Updated import
const vendorContactServices = require("../services/vendorContact.services");
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});

const { VENDOR_CONTACT_ROLE_TAGS } = require("../helper/constant");

module.exports = {
  /*addVendorsContact*/
  async addVendorsContact(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      if (req.body.role_tags) {
        const allowedRoles = Object.values(VENDOR_CONTACT_ROLE_TAGS);

        const invalidRoles = req.body.role_tags.filter(
          (role) => !allowedRoles.includes(role)
        );

        if (invalidRoles.length > 0) {
          return res.status(400).send({
            status: false,
            message: `Invalid role_tags: ${invalidRoles.join(
              ", "
            )}. Allowed: ${allowedRoles.join(", ")}`,
            data: {},
          });
        }
      }

      const data = req.body;

      const postData = {
        vendor_id: data.vendor_id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email || null,
        phone: data.phone || null,
        // role_tags: Array.isArray(req.body.role_tags)
        //   ? req.body.role_tags
        //   : req.body.role_tags?.split(",").map(r => r.trim()),
        role_tags: req.body.role_tags || null,
      };

      await vendorContactServices.addVendorsContact(postData);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            {},
            "Vendor contact added successfully"
          )
        );
    } catch (error) {
      logger.error(error);
      return res.status(400).json({
        status: false,
        message: error.message || "Add vendor contact failed",
        data: {},
      });
    }
  },
  /*getVendorsContactById*/
  async getVendorsContactById(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let vendorId = req.query.vendorId;
      let vendor = await vendorContactServices.getVendorsContactById(vendorId);
      if (!vendor) {
        throw new Error("Vendor contact not found");
      }
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            vendor,
            "Vendor contact displayed successfully"
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
  /*getAllVendorsContact*/
  async getAllVendorsContact(req, res) {
    try {
      const { page = 1, per_page = 10, search = "", id = "", take_all = "false" } = req.query;

      const vendors = await vendorContactServices.getAllVendorsContact({
        page,
        per_page,
        search,
        id,
        take_all
      });

      return res.status(200).send({
        status: true,
        message: "Vendor contacts displayed successfully",
        data: vendors.data,
        meta: vendors.meta
      });

    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Getting vendor contacts failed",
        data: error.response?.data || {},
      });
    }
  },
  /*deleteVendorsContact*/
  async deleteVendorsContact(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      let vendorId = req.query.vendorId;
      let vendor = await vendorContactServices.getVendorsContactById(vendorId);
      if (!vendor) {
        throw new Error("Vendor contact not found");
      }
      let deletevendor = await vendorContactServices.deleteVendorsContact(vendorId);
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            deletevendor,
            "Vendor contact deleted successfully"
          )
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Vendor contact deletion failed",
        data: error.response?.data || {},
      });
    }
  },
  /*updateVendorsContact*/
  async updateVendorsContact(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const vendorContactId = req.query.vendorId;

      // Check if record exists
      let vendorContact = await vendorContactServices.getVendorsContactById(vendorContactId);
      if (!vendorContact) {
        throw new Error("Vendor contact not found");
      }

      let roles = null;
      if (req.body.role_tags) {
        const allowedRoles = Object.values(VENDOR_CONTACT_ROLE_TAGS);
        roles = Array.isArray(req.body.role_tags)
          ? req.body.role_tags
          : req.body.role_tags.split(",").map(r => r.trim());

        const invalidRoles = roles.filter(role => !allowedRoles.includes(role));
        if (invalidRoles.length > 0) {
          return res.status(400).send({
            status: false,
            message: `Invalid role_tags: ${invalidRoles.join(
              ", "
            )}. Allowed: ${allowedRoles.join(", ")}`,
            data: {},
          });
        }
      }

      let data = req.body;

      let postData = {
        vendor_id: data.vendor_id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email || null,
        phone: data.phone || null,
        // role_tags: Array.isArray(req.body.role_tags)
        //   ? req.body.role_tags
        //   : req.body.role_tags?.split(",").map(r => r.trim()),
        role_tags: roles || null,
      };

      await vendorContactServices.updateVendorsContact(postData, vendorContactId);

      return res.status(200).send(
        commonHelper.parseSuccessRespose("", "Vendor contact updated successfully")
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
