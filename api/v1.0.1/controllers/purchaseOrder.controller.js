require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator");
const purchaseOrderServices = require("../services/purchaseOrder.services");

const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});

module.exports = {
  /*addPurchaseOrder*/
  async addPurchaseOrder(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const { header, lines } = req.body;

      if (!header || !lines || !Array.isArray(lines) || lines.length === 0) {
        return res.status(400).json({
          status: false,
          message: "Header and Lines are required",
        });
      }

      await purchaseOrderServices.addPurchaseOrder(header, lines);
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose("", "Purchase Order Created Successfully")
        );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Purchase Order failed",
        data: error.response?.data || {},
      });
    }
  },

  async submitApprovePurchaseOrder(req, res) {
    try {
      const { po_id } = req.body;

      if (!po_id) {
        return res.status(400).json({
          status: false,
          message: "po_id is required",
          data: {}
        });
      }

      await purchaseOrderServices.submitApprovePurchaseOrder(
        po_id,
      );

      return res.status(200).json({
        status: true,
        message: "Purchase Order approved successfully",
        data: {}
      });

    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Failed to approve Purchase Order",
        data: {}
      });
    }
  },

  async rejectPurchaseOrder(req, res) {
    try {
      const { po_id } = req.body;

      if (!po_id) {
        return res.status(400).json({
          status: false,
          message: "po_id is required"
        });
      }

      await purchaseOrderServices.rejectPurchaseOrder(
        po_id,

      );

      return res.json({
        status: true,
        message: "Purchase Order rejected successfully"
      });

    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message
      });
    }
  },

  async sendPurchaseOrder(req, res) {
    try {
      const { po_id } = req.body;

      if (!po_id) {
        return res.status(400).json({
          status: false,
          message: "PO ID is required",
        });
      }

      const result = await purchaseOrderServices.sendPurchaseOrder(po_id);

      return res.status(200).json({
        status: true,
        message: "Purchase Order sent successfully",
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Send PO failed",
        data: error.response?.data || {},
      });
    }
  },

  async addPOReceipt(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const { po_id, warehouse_id, lines } = req.body;

      if (!po_id || !warehouse_id || !lines || !Array.isArray(lines) || lines.length === 0) {
        return res.status(400).json({
          status: false,
          message: "PO ID, Warehouse ID and Lines are required",
        });
      }

      const result = await purchaseOrderServices.addPOReceipt(po_id, warehouse_id, lines);

      return res
        .status(200)
        .send(commonHelper.parseSuccessRespose(result, "PO Receipt Created Successfully"));
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Add PO Receipt failed",
        data: error.response?.data || {},
      });
    }
  },
  async closePurchaseOrder(req, res) {
    try {
      const { po_id } = req.body;

      if (!po_id) {
        return res.status(400).json({
          status: false,
          message: "PO ID is required",
        });
      }

      await purchaseOrderServices.closePurchaseOrder(po_id);
      return res.status(200).json({
        status: true,
        message: "PO closed successfully",
      });

    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }



};
