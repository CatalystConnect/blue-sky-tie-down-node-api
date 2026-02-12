var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op } = require("sequelize");
const { MATCH_STATUS, PAYMENT_STATUS } = require("../helper/constant");

module.exports = {
  /*addInnvoiceVendor*/
  async addInnvoiceVendor(postData) {
    try {

      let totalAmount = 0;
      postData.lines.forEach(line => {
        totalAmount += Number(line.billed_qty) * Number(line.unit_cost);
      });


      let matchStatus = MATCH_STATUS.EXCEPTION;
      let paymentStatus = PAYMENT_STATUS.UNPAID;

      const header = await db.invoiceHeaderObj.create(
        {
          vendor_id: postData.vendor_id,
          vendor_invoice_num: postData.vendor_invoice_num,
          invoice_date: postData.invoice_date,
          due_date: postData.due_date,
          invoice_total: totalAmount,
          match_status: matchStatus,
          payment_status: paymentStatus
        }
      );


      const linesData = postData.lines.map(line => ({
        invoice_id: header.id,
        receipt_line_id: line.receipt_line_id || null,
        po_line_id: line.po_line_id || null,
        billed_qty: line.billed_qty,
        unit_cost: line.unit_cost,
        gl_expense_acct: line.gl_expense_acct || null
      }));


      if (linesData.length > 0) {
        await db.invoiceLineObj.bulkCreate(linesData);
      }

      return {
        header,
        lines: linesData
      };

    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  }



};
