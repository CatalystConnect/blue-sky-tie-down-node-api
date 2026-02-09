require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const { check, validationResult } = require("express-validator");
const purchaseOrderServices = require("../services/purchaseOrder.services");

const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});

const { PURCHASE_ORDER_STATUS } = require("../helper/constant");

module.exports = {
  /*addPurchaseOrder*/
  // async addPurchaseOrder(req, res) {
  //   try {
  //     const errors = myValidationResult(req);
  //     if (!errors.isEmpty()) {
  //       return res
  //         .status(200)
  //         .send(commonHelper.parseErrorRespose(errors.mapped()));
  //     }

  //     const { header, lines } = req.body;

  //     if (!header || !lines || !Array.isArray(lines) || lines.length === 0) {
  //       return res.status(400).json({
  //         status: false,
  //         message: "Header and Lines are required",
  //       });
  //     }

  //     await purchaseOrderServices.addPurchaseOrder(header, lines);
  //     return res
  //       .status(200)
  //       .send(
  //         commonHelper.parseSuccessRespose("", "Purchase Order Created Successfully")
  //       );
  //   } catch (error) {
  //     return res.status(400).json({
  //       status: false,
  //       message:
  //         error.response?.data?.error ||
  //         error.message ||
  //         "Purchase Order failed",
  //       data: error.response?.data || {},
  //     });
  //   }
  // },
  async addPurchaseOrder(req, res) {
    try {
      const errors = myValidationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }

      const { purchaseOrder, header, lines, totals, status } = req.body;

      if (!purchaseOrder || !lines || lines.length === 0) {
        return res.status(400).json({
          status: false,
          message: "Purchase order & lines are required",
        });
      }

      const userId = req.userId;
      purchaseOrder.enteredBy = userId;


      await purchaseOrderServices.addPurchaseOrder({
        purchaseOrder,
        header,
        lines,
        totals,
        status
      });

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            "",
            "Purchase Order Created Successfully"
          )
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
  },

  async getPurchaseOrder(req, res) {
    try {
      const {
        page = 1,
        per_page = 10,
        search,
        status,
        supplier_id,
      } = req.query;

      const result = await purchaseOrderServices.getPurchaseOrder({
        page: parseInt(page),
        per_page: parseInt(per_page),
        search,
        status,
        supplier_id,
      });

      return res.status(200).json({
        status: true,
        message: "Purchase Orders fetched successfully",
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Failed to fetch purchase orders",
      });
    }
  },
  async getPurchaseOrders(req, res) {
    try {
      const {
        status,
        vendorId,
        fromDate,
        toDate,
        page = 1,
        per_page = 10
      } = req.query;

      const data = await purchaseOrderServices.getPurchaseOrders({
        status,
        vendorId,
        fromDate,
        toDate,
        page,
        per_page
      });

      return res.status(200).send(
        commonHelper.parseSuccessRespose(
          data,
          "Purchase Orders fetched successfully"
        )
      );

    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Failed to fetch purchase orders"
      });
    }
  },

  async getPurchaseOrderById(req, res) {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Purchase Order ID is required"
        });
      }

      const data = await purchaseOrderServices.getPurchaseOrderById(id);

      if (!data) {
        return res.status(404).json({
          status: false,
          message: "Purchase Order not found"
        });
      }

      return res.status(200).send(
        commonHelper.parseSuccessRespose(
          data,
          "Purchase Order fetched successfully"
        )
      );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Failed to fetch purchase order"
      });
    }
  },

  async updatePurchaseOrder(req, res) {
    try {
      const { id } = req.query;
      const payload = req.body;

      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Purchase Order ID is required"
        });
      }

      // status validation (if provided)
      if (
        payload.status &&
        !Object.values(PURCHASE_ORDER_STATUS).includes(payload.status)
      ) {
        return res.status(400).json({
          status: false,
          message: "Invalid purchase order status"
        });
      }

      const updated = await purchaseOrderServices.updatePurchaseOrder(
        id,
        payload
      );

      if (!updated) {
        return res.status(404).json({
          status: false,
          message: "Purchase Order not found"
        });
      }

      return res.status(200).send(
        commonHelper.parseSuccessRespose(
          "",
          "Purchase Order updated successfully"
        )
      );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message || "Failed to update purchase order"
      });
    }
  },

  async deletePurchaseOrder(req, res) {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Purchase Order ID is required"
        });
      }

      const deleted = await purchaseOrderServices.deletePurchaseOrder(id);

      if (!deleted) {
        return res.status(404).json({
          status: false,
          message: "Purchase Order not found"
        });
      }

      return res.status(200).send(
        commonHelper.parseSuccessRespose(
          "",
          "Purchase Order deleted successfully"
        )
      );

    } catch (error) {
      logger.errorLog.log("error", error.message);

      return res.status(400).json({
        status: false,
        message: error.message || "Failed to delete purchase order"
      });
    }
  },
  async updatePurchaseOrderStatus(req, res) {
    try {
      const { poId } = req.query;
      const { status } = req.body;

      if (!poId || !status) {
        return res.status(400).json({
          status: false,
          message: "poId and status are required",
        });
      }

      if (!Object.values(PURCHASE_ORDER_STATUS).includes(status)) {
        return res.status(400).json({
          status: false,
          message: "Invalid purchase order status",
        });
      }

      const updated =
        await purchaseOrderServices.updatePurchaseOrderStatus(
          poId,
          status
        );

      if (!updated) {
        return res.status(404).json({
          status: false,
          message: "Purchase Order not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Purchase Order status updated successfully",
      });
    } catch (error) {
      logger.errorLog.log("error", error.message);
      return res.status(500).json({
        status: false,
        message: error.message || "Status update failed",
      });
    }
  },
  async createReceiptPurchaseOrder(req, res) {
    try {
      const result = await purchaseOrderServices.createReceiptPurchaseOrder(req.body);
      return res.status(201).json({
        success: true,
        message: "Receipt created successfully",
        data: result
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  },
  async getVendorPOForReceipt(req, res) {
  try {
    const { vendor_id } = req.query;

    if (!vendor_id) {
      return res.status(400).json({
        success: false,
        message: "vendor_id is required",
      });
    }

    const data = await purchaseOrderServices.getVendorPOForReceipt(vendor_id);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}







};
