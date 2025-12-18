var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op, Sequelize } = require("sequelize");

module.exports = {
  /*addPurchaseOrder*/
  async addPurchaseOrder(headerData, lineData) {
    try {

      const existingPO = await db.purchaseOrderHeaderObj.findOne({
        where: { po_number: headerData.po_number }
      });

      if (existingPO) {
        throw new Error(`PO Number ${headerData.po_number} already exists`);
      }


      for (const line of lineData) {
        const vendorItem = await db.vendorItemObj.findOne({
          where: {
            id: line.vendor_item_id,
          }
        });

        if (!vendorItem) {
          throw new Error("Invalid or inactive vendor item");
        }


        if (line.ordered_qty < vendorItem.min_order_qty) {
          throw new Error(
            `Minimum order quantity is ${vendorItem.min_order_qty}`
          );
        }

        if (
          vendorItem.order_multiple_qty &&
          line.ordered_qty % vendorItem.order_multiple_qty !== 0
        ) {
          throw new Error(
            `Quantity must be in multiples of ${vendorItem.order_multiple_qty}`
          );
        }
      }


      let header = await db.purchaseOrderHeaderObj.create(headerData);

      // const lines = await Promise.all(
      //   lineData.map((line) => {
      //     return db.purchaseOrderLineObj.create(
      //       {
      //         ...line,
      //         po_id: header.id,
      //       }

      //     );
      //   })
      // );

      const lines = await Promise.all(
        lineData.map((line) => {
          const stock_qty = line.ordered_qty * line.conversion_factor;
          const extended_cost = line.ordered_qty * line.unit_cost;

          return db.purchaseOrderLineObj.create({
            po_id: header.id,
            item_id: line.item_id,
            vendor_item_id: line.vendor_item_id,
            ordered_qty: line.ordered_qty,
            uom_code: line.uom_code,
            conversion_factor: line.conversion_factor,
            stock_qty,
            unit_cost: line.unit_cost,
            extended_cost,
            received_qty: 0,
            canceled_qty: 0,
            is_closed: false,
            pricing_source: line.pricing_source || "BASE",
          });
        })
      );


      return { header, lines };
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  async submitApprovePurchaseOrder(poId) {
    try {

      const po = await db.purchaseOrderHeaderObj.findByPk(poId);

      if (!po) {
        throw new Error("Purchase Order not found");
      }

      // po.status = "PENDING_APPROVAL";
      // await po.save();

      await po.update({
        status: "PENDING_APPROVAL",
        approval_status: "PENDING",
      });

      return po;

    } catch (e) {
      logger.errorLog.log("error", e.message);
      throw e;
    }
  },

  async rejectPurchaseOrder(poId) {
    const po = await db.purchaseOrderHeaderObj.findByPk(poId);

    if (!po) throw new Error("PO not found");

    if (po.status !== "PENDING_APPROVAL") {
      throw new Error("Only pending approval PO can be rejected");
    }

    await po.update({
      status: "DRAFT",
      approval_status: "REJECTED",
    });

    return po;
  },

  async sendPurchaseOrder(po_id) {
    try {

      // const po = await db.purchaseOrderHeaderObj.findByPk(po_id);
      const po = await db.purchaseOrderHeaderObj.findByPk(po_id, {
        include: [
          {
            model: db.vendorsObj,
            as: "vendorEmail",
            attributes: ["id", "email", "name"]
          }
        ]
      });
      
      if (!po) throw new Error("PO not found");

      if (po.status !== "PENDING_APPROVAL") {
        throw new Error(
          `PO cannot be approved in ${po.status} status`
        );
      }

      await po.update({
        status: "SENT",
        approval_status: "APPROVED",
      });

      if (!po.vendorEmail || !po.vendorEmail.email) {
        throw new Error("Vendor email not found");
      }

      console.log(' po.vendorEmail.email,a',  po.vendorEmail.email)

      await commonHelper.sendPOEmail(
        po.vendorEmail.email,
        po.po_number
      );

      // po.status = "SENT";
      // await po.save();

      return po;
    } catch (e) {

      throw e;
    }
  },

  async addPOReceipt(po_id, warehouse_id, lines) {

    const po = await db.purchaseOrderHeaderObj.findByPk(po_id);
    if (!po) throw new Error("PO not found");


    switch (po.status) {
      case "DRAFT":
        throw new Error("Cannot receive PO in DRAFT status");
      case "SENT":
      case "PARTIALLY_RECEIVED":
        break;
      case "RECEIVED":
      case "CLOSED":
        throw new Error(`Cannot receive PO in ${po.status} status`);
      default:
        throw new Error(`Invalid PO status: ${po.status}`);
    }

    if (po.ship_to_warehouse_id !== warehouse_id) {
      throw new Error("Receipt warehouse does not match PO warehouse");
    }


    const receipt = await db.purchaseOrderReceiptHeaderObj.create(
      {
        po_id,
        warehouse_id,
        receipt_number: `RCT-${Date.now()}`,
        received_at: new Date(),
        posted_to_gl: false,
      }

    );


    for (let line of lines) {
      const poLine = await db.purchaseOrderLineObj.findByPk(line.po_line_id);
      if (!poLine) throw new Error(`PO Line ${line.po_line_id} not found`);

      if (poLine.po_id !== po_id) {
        throw new Error("PO line does not belong to this PO");
      }

      // const remainingQty = poLine.ordered_qty - line.received_qty;

      // console.log('dddddddddd',remainingQty)
      // console.log('dddddddddd',line.received_qty )
      // if (line.received_qty > remainingQty) {
      //   throw new Error(
      //     `Received qty exceeds remaining qty for item ${poLine.item_id}. Remaining: ${remainingQty}`
      //   );
      // }

      await db.purchaseOrderReceiptLineObj.create({
        receipt_id: receipt.id,
        po_line_id: poLine.id,
        item_id: poLine.item_id,
        received_qty: line.received_qty,
        lot_number: line.lot_number || null,
        expiration_date: line.expiration_date || null,
      });


      // await db.purchaseOrderReceiptLineObj.create(
      //   {
      //     receipt_id: receipt.id,
      //     po_line_id: poLine.id,
      //     item_id: poLine.item_id,
      //     received_qty: line.received_qty,
      //     lot_number: line.lot_number || null,
      //     expiration_date: line.expiration_date || null,
      //   },

      // );


      poLine.received_qty += line.received_qty;
      if (poLine.received_qty >= poLine.ordered_qty) poLine.is_closed = true;
      await poLine.save();



      const warehouseItem = await db.warehouseItemsObj.findOne({
        where: { warehouse_id, item_id: poLine.item_id },

      });

      if (!warehouseItem) throw new Error(`Warehouse Item not found for item ${poLine.item_id}`);

      if (warehouseItem.onPO < line.received_qty) {
        throw new Error("Invalid onPO quantity");
      }
      warehouseItem.onHand += line.received_qty;
      warehouseItem.onPO -= line.received_qty;
      await warehouseItem.save();


    }


    const allLines = await db.purchaseOrderLineObj.findAll({ where: { po_id } });
    if (allLines.every(l => l.is_closed)) {
      po.status = "RECEIVED";
    } else {
      po.status = "PARTIALLY_RECEIVED";
    }
    await po.save();

    return receipt;

  },
  async closePurchaseOrder(po_id) {
    const po = await db.purchaseOrderHeaderObj.findByPk(po_id);
    if (!po) throw new Error("PO not found");


    if (!["SENT", "PARTIALLY_RECEIVED"].includes(po.status)) {
      throw new Error("Only SENT or PARTIALLY_RECEIVED POs can be closed");
    }


    const lines = await db.purchaseOrderLineObj.findAll({ where: { po_id } });

    for (let line of lines) {
      if (!line.is_closed) {
        line.is_closed = true;
        await line.save();
      }
    }


    po.status = "CLOSED";
    await po.save();

    return po;
  }



};
