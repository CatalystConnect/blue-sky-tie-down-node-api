var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op, Sequelize } = require("sequelize");

module.exports = {
  /*addPurchaseOrder*/
  async addPurchaseOrder(headerData, lineData) {
    try {
      let header = await db.purchaseOrderHeaderObj.create(headerData);

      const lines = await Promise.all(
        lineData.map((line) => {
          return db.purchaseOrderLineObj.create(
            {
              ...line,
              po_id: header.id,
            }

          );
        })
      );

      return { header, lines };
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw e;
    }
  },

  async sendPurchaseOrder(po_id) {
    try {
   
      const po = await db.purchaseOrderHeaderObj.findByPk(po_id);
      if (!po) throw new Error("PO not found");

      if (po.status !== "DRAFT") throw new Error("Only DRAFT PO can be sent");

      po.status = "SENT";
      await po.save();

      return po;
    } catch (e) {
      logger.error(e);
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
        break;
      case "RECEIVED":
      case "CLOSED":
        throw new Error("PO already received or closed");
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


      await db.purchaseOrderReceiptLineObj.create(
        {
          receipt_id: receipt.id,
          po_line_id: poLine.id,
          item_id: poLine.item_id,
          received_qty: line.received_qty,
          lot_number: line.lot_number || null,
          expiration_date: line.expiration_date || null,
        },

      );


      poLine.received_qty += line.received_qty;
      if (poLine.received_qty >= poLine.ordered_qty) poLine.is_closed = true;
      await poLine.save();

      const warehouseItem = await db.warehouseItemsObj.findOne({
        where: { warehouse_id, item_id: poLine.item_id },

      });
      if (!warehouseItem) throw new Error(`Warehouse Item not found for item ${poLine.item_id}`);

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


};
