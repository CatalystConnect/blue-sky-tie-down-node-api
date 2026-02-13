require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator");
const voucherServices = require("../services/voucher.services");
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});

const { MATCH_STATUS, PAYMENT_STATUS } = require("../helper/constant");

module.exports = {
  /*add Voucher*/
  async addVoucher(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const { header } = req.body;

      if (!header) {
        return res.status(400).send({
          status: false,
          message: "Header is required"
        });
      }

      // if (!lines || !Array.isArray(lines) || lines.length === 0) {
      //   return res.status(400).send({
      //     status: false,
      //     message: "Lines are required"
      //   });
      // }
      const postData = {
        header
      
      };
      const voucher = await voucherServices.addVoucher(postData);

      return res
        .status(200)
        .send({
          status: true,
          message: "Voucher created successfully",
          data: voucher.data,
          // meta: voucher.meta
        });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.response?.data?.error || error.message || "Voucher creation failed",
        data: error.response?.data || {},
      });
    }
  },

  async getAllVouchers(req, res) {
    try {
      const {
        page = 1,
        per_page = 10,
        search = "",
        from_date,
        to_date
      } = req.query;

      const result = await voucherServices.getAllVouchers({
        page,
        per_page,
        search,
        from_date,
        to_date
      });

      return res.status(200).send({
        status: true,
        message: "Vouchers fetched successfully",
        data: result.data,
        meta: result.meta
      });
    } catch (error) {
      console.error("Get vouchers error:", error.message);
      return res.status(500).json({
        status: false,
        message: error.message || "Failed to fetch vouchers",
        data: {}
      });
    }
  },
  async getVoucherById(req, res) {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Voucher ID is required",
          data: {}
        });
      }

      const result = await voucherServices.getVoucherById(id);

      if (!result) {
        return res.status(404).json({
          status: false,
          message: "Voucher not found",
          data: {}
        });
      }

      return res.status(200).json({
        status: true,
        message: "Voucher fetched successfully",
        data: result
      });
    } catch (error) {
      console.error("Get voucher error:", error.message);
      return res.status(500).json({
        status: false,
        message: error.message || "Failed to fetch voucher",
        data: {}
      });
    }
  },
  async updateVoucher(req, res) {
    try {
      const { id } = req.query;
      const { header} = req.body;

      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Voucher ID is required",
          data: {}
        });
      }

      if (!header) {
        return res.status(400).json({
          status: false,
          message: "Header data is required",
          data: {}
        });
      }

      // if (!lines || !Array.isArray(lines) || lines.length === 0) {
      //   return res.status(400).json({
      //     status: false,
      //     message: "Lines are required",
      //     data: {}
      //   });
      // }

      const result = await voucherServices.updateVoucher(id, {
        header
        
      });

      return res.status(200).json({
        status: true,
        message: "Voucher updated successfully",
        data: result.data,
        // meta: result.meta
      });

    } catch (error) {
      console.error("Update voucher error:", error.message);
      return res.status(500).json({
        status: false,
        message: error.message || "Failed to update voucher",
        data: {}
      });
    }
  },
  async deleteVoucher(req, res) {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Voucher ID is required",
          data: {}
        });
      }

      const result = await voucherServices.deleteVoucher(id);

      return res.status(200).json({
        status: true,
        message: "Voucher deleted successfully",
        data: result
      });

    } catch (error) {
      console.error("Delete voucher error:", error.message);
      return res.status(500).json({
        status: false,
        message: error.message || "Failed to delete voucher",
        data: {}
      });
    }
  }






};
