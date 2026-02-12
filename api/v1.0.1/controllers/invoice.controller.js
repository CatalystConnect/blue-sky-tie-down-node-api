require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator");
const invoiceServices = require("../services/invoice.services");
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});

const { MATCH_STATUS, PAYMENT_STATUS } = require("../helper/constant");

module.exports = {
  /*add Invoice*/
  async addInnvoiceVendor(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const { header, lines } = req.body;

      if (!header) {
        return res.status(400).send({
          status: false,
          message: "Header is required"
        });
      }

      if (!lines || !Array.isArray(lines) || lines.length === 0) {
        return res.status(400).send({
          status: false,
          message: "Lines are required"
        });
      }


      const postData = {
        header,
        lines
      };

      const unit = await invoiceServices.addInnvoiceVendor(postData);

      return res
        .status(200)
        .send({
          status: true,
          message: "Invoice created successfully",
          data: unit.data,
          meta: unit.meta
        });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.response?.data?.error || error.message || "Invoice creation failed",
        data: error.response?.data || {},
      });
    }
  },


};
