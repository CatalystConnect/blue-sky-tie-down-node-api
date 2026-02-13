var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op } = require("sequelize");
const { VOUCHER_STATUS } = require("../helper/constant");

module.exports = {
  /*addVoucher*/
  async addVoucher(postData) {

    try {
      const { header } = postData;

      const existingVoucher = await db.voucherHeaderObj.findOne({
        where: { voucher_number: header.voucher_number }
      });

      if (existingVoucher) {
        throw new Error("Voucher number already exists");
      }


      const voucherHeader = await db.voucherHeaderObj.create(
        {
          voucher_number: header.voucher_number,
          voucher_date: header.voucher_date,
          vendor_id: header.vendor_id,
          vendor_name: header.vendor_name,
          po_number: header.po_number,
          invoice_number: header.invoice_number,
          discount_amount: header.discount_amount || 0,
          memo: header.memo,
          term_code: header.term_code,
          due_date: header.due_date,
          currency: header.currency || "USD",
          exchange_rate: header.exchange_rate || 1,
          foreign_currency: header.foreign_currency || false,
          account_number: header.account_number,
          amount_in_words: header.amount_in_words,
          voucher_description: header.voucher_description,
          on_check: header.on_check,
          approved_by: header.approved_by,
          amount:header.amount,
          status:VOUCHER_STATUS.OPEN
        }
      );

      // let totalAmount = 0;


      // const lineData = [];

      // for (let i = 0; i < lines.length; i++) {
      //   const line = lines[i];

      //   const extension =
      //     parseFloat(line.qty_invoiced || 0) *
      //     parseFloat(line.invoiced_cost || 0);

      //   totalAmount += extension;

      //   lineData.push({
      //     voucher_id: voucherHeader.id,
      //     line_number: i + 1,
      //     po_number: line.po_number,
      //     po_line_id: line.po_line_id,
      //     item_code: line.item_code,
      //     revision_seq: line.revision_seq,
      //     qty_received: line.qty_received || 0,
      //     qty_invoiced: line.qty_invoiced || 0,
      //     unit_of_measure: line.unit_of_measure,
      //     received_cost: line.received_cost || 0,
      //     invoiced_cost: line.invoiced_cost || 0,
      //     extension_amount: extension,
      //     commodity_code: line.commodity_code,
      //   });
      // }


      // await db.voucherLineObj.bulkCreate(lineData);


      // await voucherHeader.update(
      //   {
      //     total_amount: totalAmount,
      //     invoice_gross: totalAmount,
      //   }
      // );



      return {
        data: voucherHeader,
        // meta: {
        //   // total_lines: lines.length,
        //   total_amount: totalAmount,
        // },
      };
    } catch (e) {

      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },
  async getAllVouchers(params) {
    try {
      const {
        page = 1,
        per_page = 10,
        search = "",
        from_date,
        to_date
      } = params;

      const limit = parseInt(per_page);
      const offset = (page - 1) * limit;

      const whereCondition = {};

      // Search by voucher number or vendor name
      if (search) {
        whereCondition[db.Sequelize.Op.or] = [
          {
            voucher_number: {
              [db.Sequelize.Op.iLike]: `%${search}%`,
            },
          },
          {
            vendor_name: {
              [db.Sequelize.Op.iLike]: `%${search}%`,
            },
          },
        ];
      }

      // Date filter
      if (from_date && to_date) {
        whereCondition.voucher_date = {
          [db.Sequelize.Op.between]: [from_date, to_date],
        };
      }

      // Total count
      const { count, rows } = await db.voucherHeaderObj.findAndCountAll({
        where: whereCondition,
        // include: [
        //   {
        //     model: db.voucherLineObj,
        //     as: "voucher_lines",
        //     required: false,
        //   },
        // ],
        order: [["id", "DESC"]],
        limit,
        offset,
        distinct: true
      });

      // -------- Lazy Load Meta --------
      const current_count = rows.length;
      const loaded_till_now = offset + current_count;
      const remaining = Math.max(count - loaded_till_now, 0);
      const has_more = loaded_till_now < count;

      return {
        data: rows,
        meta: {
          page: parseInt(page),
          limit,
          current_count,
          loaded_till_now,
          remaining,
          total: count,
          has_more,
          total_pages: Math.ceil(count / limit),
        },
      };
    } catch (e) {
      console.error("Service error:", e.message);
      throw e;
    }
  },
  async getVoucherById(id) {
    try {
      const voucher = await db.voucherHeaderObj.findOne({
        where: { id },
        // include: [
        //   {
        //     model: db.voucherLineObj,
        //     as: "voucher_lines",
        //     required: false,
        //   },
        // ],
      });

      return voucher;
    } catch (e) {
      console.error("Service error:", e.message);
      throw e;
    }
  },
  async updateVoucher(id, postData) {


    try {
      const { header } = postData;


      const voucherHeader = await db.voucherHeaderObj.findOne({
        where: { id },

      });

      if (!voucherHeader) {
        throw new Error("Voucher not found");
      }


      if (voucherHeader.status !== "Open") {
        throw new Error("Only Open vouchers can be updated");
      }


      await voucherHeader.update(
        {
          voucher_number: header.voucher_number,
          voucher_date: header.voucher_date,
          vendor_id: header.vendor_id,
          vendor_name: header.vendor_name,
          po_number: header.po_number,
          invoice_number: header.invoice_number,
          discount_amount: header.discount_amount || 0,
          memo: header.memo,
          term_code: header.term_code,
          due_date: header.due_date,
          currency: header.currency || "USD",
          exchange_rate: header.exchange_rate || 1,
          foreign_currency: header.foreign_currency || false,
          account_number: header.account_number,
          amount_in_words: header.amount_in_words,
          voucher_description: header.voucher_description,
          on_check: header.on_check,
          approved_by: header.approved_by,
          amount:header.amount,

        }
      );


      // await db.voucherLineObj.destroy({
      //   where: { voucher_id: id },
      //   transaction
      // });


      // let totalAmount = 0;
      // const lineData = [];

      // for (let i = 0; i < lines.length; i++) {
      //   const line = lines[i];

      //   const extension =
      //     parseFloat(line.qty_invoiced || 0) *
      //     parseFloat(line.invoiced_cost || 0);

      //   totalAmount += extension;

      //   lineData.push({
      //     voucher_id: id,
      //     line_number: i + 1,
      //     po_number: line.po_number,
      //     po_line_id: line.po_line_id,
      //     item_code: line.item_code,
      //     revision_seq: line.revision_seq,
      //     qty_received: line.qty_received || 0,
      //     qty_invoiced: line.qty_invoiced || 0,
      //     unit_of_measure: line.unit_of_measure,
      //     received_cost: line.received_cost || 0,
      //     invoiced_cost: line.invoiced_cost || 0,
      //     extension_amount: extension,
      //     commodity_code: line.commodity_code,
      //   });
      // }

      // await db.voucherLineObj.bulkCreate(lineData);

      // await voucherHeader.update(
      //   {
      //     total_amount: totalAmount,
      //     invoice_gross: totalAmount,
      //   }
      // );



      return {
        data: voucherHeader,
        // meta: {
        //   total_lines: lines.length,
        //   total_amount: totalAmount
        // }
      };

    } catch (e) {

      console.error("Service error:", e.message);
      throw e;
    }
  },
  async deleteVoucher(id) {


    try {

      const voucherHeader = await db.voucherHeaderObj.findOne({
        where: { id }
      });

      if (!voucherHeader) {
        throw new Error("Voucher not found");
      }


      if (voucherHeader.status !== "Open") {
        throw new Error("Only Open vouchers can be deleted");
      }


      await db.voucherLineObj.destroy({
        where: { voucher_id: id }
      });


      await voucherHeader.destroy();



      return {
        id: id
      };

    } catch (e) {

      console.error("Service error:", e.message);
      throw e;
    }
  }








};
