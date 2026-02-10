var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const db = require("../models");
const { Op, Sequelize } = require("sequelize");
const { PURCHASE_ORDER_STATUS } = require("../helper/constant");

module.exports = {
  /*addPurchaseOrder*/
  // async addPurchaseOrder(headerData, lineData) {
  //   try {

  //     const existingPO = await db.purchaseOrderHeaderObj.findOne({
  //       where: { po_number: headerData.po_number }
  //     });

  //     if (existingPO) {
  //       throw new Error(`PO Number ${headerData.po_number} already exists`);
  //     }


  //     for (const line of lineData) {
  //       const vendorItem = await db.vendorItemObj.findOne({
  //         where: {
  //           id: line.vendor_item_id,
  //         }
  //       });

  //       if (!vendorItem) {
  //         throw new Error("Invalid or inactive vendor item");
  //       }


  //       if (line.ordered_qty < vendorItem.min_order_qty) {
  //         throw new Error(
  //           `Minimum order quantity is ${vendorItem.min_order_qty}`
  //         );
  //       }

  //       if (
  //         vendorItem.order_multiple_qty &&
  //         line.ordered_qty % vendorItem.order_multiple_qty !== 0
  //       ) {
  //         throw new Error(
  //           `Quantity must be in multiples of ${vendorItem.order_multiple_qty}`
  //         );
  //       }
  //     }


  //     let header = await db.purchaseOrderHeaderObj.create(headerData);

  //     // const lines = await Promise.all(
  //     //   lineData.map((line) => {
  //     //     return db.purchaseOrderLineObj.create(
  //     //       {
  //     //         ...line,
  //     //         po_id: header.id,
  //     //       }

  //     //     );
  //     //   })
  //     // );

  //     const lines = await Promise.all(
  //       lineData.map((line) => {
  //         const stock_qty = line.ordered_qty * line.conversion_factor;
  //         const extended_cost = line.ordered_qty * line.unit_cost;

  //         return db.purchaseOrderLineObj.create({
  //           po_id: header.id,
  //           item_id: line.item_id,
  //           vendor_item_id: line.vendor_item_id,
  //           ordered_qty: line.ordered_qty,
  //           uom_code: line.uom_code,
  //           conversion_factor: line.conversion_factor,
  //           stock_qty,
  //           unit_cost: line.unit_cost,
  //           extended_cost,
  //           received_qty: 0,
  //           canceled_qty: 0,
  //           is_closed: false,
  //           pricing_source: line.pricing_source || "BASE",
  //         });
  //       })
  //     );


  //     return { header, lines };
  //   } catch (e) {
  //     logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
  //     throw e;
  //   }
  // },
  async addPurchaseOrder(payload) {

    try {
      const { purchaseOrder, header, lines, totals, status } = payload;


      const po = await db.purchaseOrderObj.create(
        {
          ...purchaseOrder,
          status: status || PURCHASE_ORDER_STATUS.DRAFT,
        },

      );

      const pId = po.id;


      if (header) {
        await db.poHeaderObj.create(
          {
            ...header,
            poId: pId,
          },

        );
      }


      const poLines = lines.map((line, index) => ({
        ...line,
        poId: pId,
        lineNumber: line.lineNumber || String(index + 1).padStart(3, "0"),
      }));

      const safeDateOnly = (value) => {
        if (!value) return null;
        const d = new Date(value);
        return isNaN(d.getTime())
          ? null
          : d.toISOString().split("T")[0];
      };

      // const createdLines = await db.poLineObj.bulkCreate(poLines);
      const createdLines = await db.poLineObj.bulkCreate(poLines, {
        returning: true,
      });


      const poItemsPayload = [];

      createdLines.forEach((poLine) => {
        const line = lines.find(
          (l) => l.lineNumber === poLine.lineNumber
        );

        if (line?.items?.warehouse_item_id) {
          poItemsPayload.push({
            poId: pId,
            po_line_id: poLine.id,
            warehouse_item_id: line.items.warehouse_item_id,

            on_order: line.items.on_order ?? null,
            back_order: line.items.back_order ?? null,

            requested_date: safeDateOnly(line.items.requested_date),
            exp_date: safeDateOnly(line.items.exp_date),
            expected_date: safeDateOnly(line.items.expected_date),

            order_tool: line.items.order_tool ?? null,
            warehouse: line.items.warehouse ?? null,
            cost_per: line.items.cost_per ?? null,
            received_to_date: line.items.received_to_date ?? 0,
            transfer_to_warehouse:
              line.items.transfer_to_warehouse ?? null,
            origin: line.items.origin ?? null,
            oe_linked: line.items.oe_linked ?? false,
            open_total: line.items.open_total ?? null,
            vessel: line.items.vessel ?? null,
            discount_pct: line.items.discount_pct ?? null,
            other: line.items.other ?? null,
          });
        }
      });

      if (poItemsPayload.length) {
        await db.purchaseOrderItemObj.bulkCreate(poItemsPayload);
      }



      if (totals) {
        await db.purchaseOrderTotalsObj.create(
          {
            ...totals,
            poId: pId,
          },

        );
      }


      return pId;

    } catch (err) {

      logger.errorLog.log("error", err.message);
      throw err;
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

      console.log(' po.vendorEmail.email,a', po.vendorEmail.email)

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
  },

  async getPurchaseOrder({ page, per_page, search, status, supplier_id }) {
    try {
      page = parseInt(page) || 1;
      per_page = parseInt(per_page) || 10;

      const offset = (page - 1) * per_page;

      let whereCondition = {};

      // ---------- filters (same) ----------
      if (status) {
        whereCondition.status = status;
      }

      if (supplier_id) {
        whereCondition.supplier_id = supplier_id;
      }

      if (search) {
        whereCondition[Op.or] = [
          { po_number: { [Op.like]: `%${search}%` } },
          { reference_no: { [Op.like]: `%${search}%` } },
        ];
      }

      // ---------- DB query (same) ----------
      const { rows, count } = await db.purchaseOrderHeaderObj.findAndCountAll({
        where: whereCondition,
        include: [
          {
            model: db.purchaseOrderLineObj,
            as: "purchaseOrderLines",
          },
        ],
        limit: per_page,
        offset,
        order: [["id", "DESC"]],
        distinct: true
      });

      // ---------- LAZY LOAD META (STANDARD) ----------
      const total = count;
      const current_count = rows.length;
      const loaded_till_now = offset + current_count;
      const remaining = Math.max(total - loaded_till_now, 0);
      const has_more = loaded_till_now < total;

      return {
        data: rows,
        meta: {
          page,
          limit: per_page,
          current_count,
          loaded_till_now,
          remaining,
          total,
          has_more,
        },
      };
    } catch (e) {
      throw e;
    }
  },
  async getPurchaseOrders(filters) {
    try {
      const {
        status,
        vendorId,
        fromDate,
        toDate,
        page = 1,
        per_page = 10
      } = filters;

      const where = {};

      if (status) {
        where.status = status;
      }

      if (vendorId) {
        where.vendor_id = vendorId;
      }

      if (fromDate && toDate) {
        where.dateOrdered = {
          [Op.between]: [fromDate, toDate],
        };
      }

      const limit = parseInt(per_page);
      const offset = (page - 1) * limit;

      const { rows, count } = await db.purchaseOrderObj.findAndCountAll({
        where,
        limit,
        offset,
        order: [["id", "DESC"]],
        include: [
          {
            model: db.poHeaderObj,
            as: "header",
          },
          {
            model: db.poLineObj,
            as: "lines",
            include: [
              {
                model: db.purchaseOrderItemObj,
                as: "items",
              }
            ],
          },
          {
            model: db.purchaseOrderTotalsObj,
            as: "totals",
          },
        ],
      });

      const loadedTillNow = offset + rows.length;
      const remaining = Math.max(count - loadedTillNow, 0);
      const hasMore = loadedTillNow < count;

      return {
        data: rows,
        meta: {
          total: count,
          page: parseInt(page),
          per_page: limit,
          current_count: rows.length,
          loaded_till_now: loadedTillNow,
          remaining,
          has_more: hasMore,
          last_page: Math.ceil(count / limit),
        },
      };

    } catch (e) {
      logger.errorLog.log("error", e.message);
      throw e;
    }
  },

  async getPurchaseOrderById(poId) {
    try {
      const purchaseOrder = await db.purchaseOrderObj.findOne({
        where: { id: poId },
        include: [
          {
            model: db.poHeaderObj,
            as: "header",
          },
          {
            model: db.poLineObj,
            as: "lines",
            include: [
              {
                model: db.purchaseOrderItemObj,
                as: "items",
              }
            ],
          },
          {
            model: db.purchaseOrderTotalsObj,
            as: "totals",
          },
          {
            model: db.vendorsObj,
            as: "vendorDetails",
          },
          {
            model: db.wareHouseObj,
            as: "warehouseDetails",
          },

        ],

      });

      return purchaseOrder;
    } catch (e) {
      logger.errorLog.log("error", e.message);
      throw e;
    }
  },
  // async updatePurchaseOrder(poId, payload) {

  //   try {
  //     const { purchaseOrder, header, lines, totals, status } = payload;

  //     /* ---------------- PURCHASE ORDER ---------------- */
  //     if (purchaseOrder || status) {
  //       await db.purchaseOrderObj.update(
  //         {
  //           ...purchaseOrder,
  //           ...(status && { status })
  //         },
  //         {
  //           where: { id: poId },

  //         }
  //       );
  //     }

  //     /* ---------------- HEADER ---------------- */
  //     if (header) {
  //       const existingHeader = await db.poHeaderObj.findOne({
  //         where: { poId },

  //       });

  //       if (existingHeader) {
  //         await db.poHeaderObj.update(
  //           header,
  //           { where: { poId }, transaction }
  //         );
  //       } else {
  //         await db.poHeaderObj.create(
  //           { ...header, poId },

  //         );
  //       }
  //     }

  //     /* ---------------- LINES ---------------- */
  //     if (lines && lines.length) {
  //       for (let i = 0; i < lines.length; i++) {
  //         const line = lines[i];

  //         if (line.id) {
  //           // UPDATE existing line
  //           await db.poLineObj.update(
  //             line,
  //             {
  //               where: { id: line.id, poId },

  //             }
  //           );
  //         } else {
  //           // ADD new line
  //           await db.poLineObj.create(
  //             {
  //               ...line,
  //               poId,
  //               lineNo: line.lineNo || String(i + 1).padStart(3, "0")
  //             },
  //           );
  //         }
  //       }
  //     }


  //     if (totals) {
  //       const existingTotals = await db.purchaseOrderTotalsObj.findOne({
  //         where: { poId },

  //       });

  //       if (existingTotals) {
  //         await db.purchaseOrderTotalsObj.update(
  //           totals,
  //           { where: { poId }, transaction }
  //         );
  //       } else {
  //         await db.purchaseOrderTotalsObj.create(
  //           { ...totals, poId },

  //         );
  //       }
  //     }


  //     return true;

  //   } catch (err) {

  //     logger.errorLog.log("error", err.message);
  //     throw err;
  //   }
  // },
  async updatePurchaseOrder(poId, payload) {
    try {
      const { purchaseOrder, header, lines, totals, status } = payload;

      const safeDateOnly = (value) => {
        if (!value) return null;
        const d = new Date(value);
        return isNaN(d.getTime()) ? null : d.toISOString().split("T")[0];
      };

      /* ================= PURCHASE ORDER ================= */
      if (purchaseOrder || status) {
        await db.purchaseOrderObj.update(
          {
            ...purchaseOrder,
            ...(status && { status }),
          },
          { where: { id: poId } }
        );
      }

      /* ================= HEADER ================= */
      if (header) {
        const existingHeader = await db.poHeaderObj.findOne({
          where: { poId },
        });

        if (existingHeader) {
          await db.poHeaderObj.update(header, { where: { poId } });
        } else {
          await db.poHeaderObj.create({ ...header, poId });
        }
      }

      /* ================= LINES + ITEMS ================= */
      if (lines && lines.length) {
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];

          /* -------- FIND EXISTING LINE (poId + lineNumber) -------- */
          let poLine = await db.poLineObj.findOne({
            where: {
              poId,
              lineNumber: line.lineNumber,
            },
          });

          /* -------- UPDATE OR CREATE LINE -------- */
          if (poLine) {
            await db.poLineObj.update(
              {
                item: line.item,
                description: line.description,
                orderedQty: line.orderedQty,
                uom: line.uom,
                unitCost: line.unitCost,
                orderedExt: line.orderedExt,
                lineNumber: line.lineNumber,
              },
              { where: { id: poLine.id } }
            );
          } else {
            poLine = await db.poLineObj.create({
              item: line.item,
              description: line.description,
              orderedQty: line.orderedQty,
              uom: line.uom,
              unitCost: line.unitCost,
              orderedExt: line.orderedExt,
              poId,
              lineNumber: line.lineNumber,
            });
          }

          /* -------- ITEM UPSERT (po_line_id + warehouse_item_id) -------- */
          if (line?.items?.warehouse_item_id) {
            const existingItem =
              await db.purchaseOrderItemObj.findOne({
                where: {
                  po_line_id: poLine.id,
                  warehouse_item_id: line.items.warehouse_item_id,
                },
              });

            const itemPayload = {
              poId,
              po_line_id: poLine.id,
              warehouse_item_id: line.items.warehouse_item_id,

              on_order: line.items.on_order ?? null,
              back_order: line.items.back_order ?? null,
              requested_date: safeDateOnly(line.items.requested_date),
              exp_date: safeDateOnly(line.items.exp_date),
              expected_date: safeDateOnly(line.items.expected_date),

              order_tool: line.items.order_tool ?? null,
              warehouse: line.items.warehouse ?? null,
              cost_per: line.items.cost_per ?? null,
              received_to_date: line.items.received_to_date ?? 0,
              transfer_to_warehouse:
                line.items.transfer_to_warehouse ?? null,
              origin: line.items.origin ?? null,
              oe_linked: line.items.oe_linked ?? false,
              open_total: line.items.open_total ?? null,
              vessel: line.items.vessel ?? null,
              discount_pct: line.items.discount_pct ?? null,
              other: line.items.other ?? null,
            };

            if (existingItem) {
              await db.purchaseOrderItemObj.update(itemPayload, {
                where: { id: existingItem.id },
              });
            } else {
              await db.purchaseOrderItemObj.create(itemPayload);
            }
          }
        }
      }

      /* ================= TOTALS ================= */
      if (totals) {
        const existingTotals =
          await db.purchaseOrderTotalsObj.findOne({
            where: { poId },
          });

        if (existingTotals) {
          await db.purchaseOrderTotalsObj.update(totals, {
            where: { poId },
          });
        } else {
          await db.purchaseOrderTotalsObj.create({ ...totals, poId });
        }
      }

      return true;
    } catch (err) {
      logger.errorLog.log("error", err.message);
      throw err;
    }
  },

  async deletePurchaseOrder(poId) {


    try {

      const po = await db.purchaseOrderObj.findByPk(poId);
      if (!po) return false;



      await db.poLineObj.destroy({
        where: { poId },

      });

      await db.poHeaderObj.destroy({
        where: { poId },

      });

      await db.purchaseOrderTotalsObj.destroy({
        where: { poId },

      });

      await db.purchaseOrderObj.destroy({
        where: { id: poId },

      });


      return true;

    } catch (err) {

      logger.errorLog.log("error", err.message);
      throw err;
    }
  },

  async updatePurchaseOrderStatus(poId, status) {
    try {
      const [affectedRows] =
        await db.purchaseOrderObj.update(
          { status },
          { where: { id: poId } }
        );

      return affectedRows > 0;
    } catch (e) {
      logger.errorLog.log("error", e.message);
      throw e;
    }
  },
  // async createReceiptPurchaseOrder(payload) {

  //   try {

  //     const po = await db.purchaseOrderObj.findByPk(payload.po_id);

  //     if (!po) throw new Error("Purchase Order not found");

  //     // Status validation
  //     switch (po.status) {
  //       case "Draft":
  //       case "Pending Approval":
  //       case "Closed":
  //         throw new Error(`Receipt not allowed when PO status is ${po.status}`);

  //       case "Open":
  //       case "Partially Received":
  //         break;

  //       default:
  //         throw new Error("Invalid PO status");
  //     }


  //     const receiptHeader = await db.purchaseOrderReceiptHeaderObj.create(
  //       {
  //         po_id: payload.po_id,
  //         warehouse_id: payload.warehouse_id,
  //         receipt_number: payload.receipt_number,
  //         vendor_packing_slip: payload.vendor_packing_slip,
  //         received_at: payload.received_at
  //       }
  //     );


  //     for (const line of payload.items) {

  //       await db.purchaseOrderReceiptLineObj.create(
  //         {
  //           receipt_id: receiptHeader.id,
  //           po_line_id: line.po_line_id,
  //           item_id: line.item_id,
  //           received_qty: line.received_qty,
  //           lot_number: line.lot_number,
  //           expiration_date: line.expiration_date,
  //           po_id: payload.po_id,
  //           purchase_order_item_id: line.purchase_order_item_id,
  //           warehouse_item_id: line.warehouse_item_id
  //         }
  //       );


  //       const warehouseItem = await db.warehouseItemsObj.findOne({
  //         where: { id: line.warehouse_item_id }
  //       });

  //       const currentOnHand = parseInt(warehouseItem.onHand || 0);

  //       await db.warehouseItemsObj.update(
  //         { onHand: currentOnHand + Number(line.received_qty) },
  //         { where: { id: line.warehouse_item_id } }
  //       );


  //       await db.purchaseOrderReceiptLineObj.update(
  //         {
  //           received_qty: Number(line.received_qty)
  //         },
  //         {
  //           where: { id: line.id }
  //         }
  //       );
  //     }


  //     return receiptHeader;

  //   } catch (err) {

  //     throw err;
  //   }
  // },
  // async createReceiptPurchaseOrder(payload) {
  //   try {

  //     const po = await db.purchaseOrderObj.findByPk(payload.po_id);

  //     if (!po) throw new Error("Purchase Order not found");


  //     switch (po.status) {
  //       case "Draft":
  //       case "Pending Approval":
  //       case "Closed":
  //         throw new Error(`Receipt not allowed when PO status is ${po.status}`);

  //       case "Sent":
  //       case "Partially Received":
  //         break;

  //       default:
  //         throw new Error("Invalid PO status");
  //     }


  //     const receiptHeader = await db.purchaseOrderReceiptHeaderObj.create({
  //       po_id: payload.po_id,
  //       warehouse_id: payload.warehouse_id,
  //       receipt_number: payload.receipt_number,
  //       vendor_packing_slip: payload.vendor_packing_slip,
  //       received_at: payload.received_at,
  //     });


  //     for (const line of payload.items) {


  //       await db.purchaseOrderReceiptLineObj.create({
  //         receipt_id: receiptHeader.id,
  //         po_line_id: line.po_line_id,
  //         item_id: line.item_id,
  //         received_qty: Number(line.received_qty),
  //         lot_number: line.lot_number,
  //         expiration_date: line.expiration_date,
  //         po_id: payload.po_id,
  //         purchase_order_item_id: line.purchase_order_item_id,
  //         warehouse_item_id: line.warehouse_item_id,
  //       });


  //       const warehouseItem = await db.warehouseItemsObj.findByPk(
  //         line.warehouse_item_id
  //       );

  //       const currentOnHand = parseInt(warehouseItem.onHand || 0);

  //       await db.warehouseItemsObj.update(
  //         {
  //           onHand: currentOnHand + Number(line.received_qty),
  //         },
  //         {
  //           where: { id: line.warehouse_item_id },
  //         }
  //       );


  //       await db.purchaseOrderItemObj.update(
  //         {
  //           received_to_date: payload.received_at,
  //         },
  //         {
  //           where: { id: line.purchase_order_item_id },
  //         }
  //       );
  //     }



  //     const poItems = await db.purchaseOrderItemObj.findAll({
  //       where: { po_id: payload.po_id },
  //     });

  //     let allReceived = true;

  //     for (const item of poItems) {
  //       const totalReceived = await db.purchaseOrderReceiptLineObj.sum(
  //         "received_qty",
  //         {
  //           where: {
  //             purchase_order_item_id: item.id,
  //           },
  //         }
  //       );

  //       if ((totalReceived || 0) < item.orderedQty) {
  //         allReceived = false;
  //         break;
  //       }
  //     }

  //     const newStatus = allReceived
  //       ? "Closed"
  //       : "Partially Received";

  //     await db.purchaseOrderObj.update(
  //       { status: newStatus },
  //       { where: { id: payload.po_id } }
  //     );

  //     return receiptHeader;
  //   } catch (err) {
  //     throw err;
  //   }
  // },
  async createReceiptPurchaseOrder(payload) {
    try {

      const po = await db.purchaseOrderObj.findByPk(payload.po_id);

      if (!po) throw new Error("Purchase Order not found");


      switch (po.status) {
        case PURCHASE_ORDER_STATUS.DRAFT:
        case PURCHASE_ORDER_STATUS.PENDING_APPROVAL:
        case PURCHASE_ORDER_STATUS.CLOSED:
          throw new Error(
            `Receipt not allowed when PO status is ${po.status}`
          );

        case PURCHASE_ORDER_STATUS.SENT:
        case PURCHASE_ORDER_STATUS.PARTIALLY_RECEIVED:
          break;

        default:
          throw new Error("Invalid PO status");
      }


      const receiptHeader =
        await db.purchaseOrderReceiptHeaderObj.create({
          po_id: payload.po_id,
          warehouse_id: payload.warehouse_id,
          receipt_number: payload.receipt_number,
          vendor_packing_slip: payload.vendor_packing_slip,
          received_at: payload.received_at,
        });


      for (const line of payload.items) {

        const poLine = await db.poLineObj.findByPk(line.po_line_id);
        if (!poLine) throw new Error(`PO Line not found: ${line.po_line_id}`);

        const totalReceivedSoFar = await db.purchaseOrderReceiptLineObj.sum(
          "received_qty",
          { where: { po_line_id: line.po_line_id } }
        );


        const incomingQty = Number(line.received_qty);
        const maxAllowed = poLine.orderedQty - (totalReceivedSoFar || 0);

        if (incomingQty > maxAllowed) {
          throw new Error(
            `Received quantity (${incomingQty}) exceeds remaining ordered quantity (${maxAllowed}) for PO Line ${poLine.lineNumber}`
          );
        }


        await db.purchaseOrderReceiptLineObj.create({
          receipt_id: receiptHeader.id,
          po_line_id: line.po_line_id,
          item_id: line.item_id,
          received_qty: Number(line.received_qty),
          lot_number: line.lot_number,
          expiration_date: line.expiration_date,
          po_id: payload.po_id,
          purchase_order_item_id: line.purchase_order_item_id,
          warehouse_item_id: line.warehouse_item_id,
        });


        const warehouseItem = await db.warehouseItemsObj.findByPk(
          line.warehouse_item_id
        );
        console.log('warehouseItem', warehouseItem)

        const currentOnHand = parseInt(warehouseItem.onHand || 0);

        await db.warehouseItemsObj.update(
          {
            onHand: currentOnHand + Number(line.received_qty),
          },
          {
            where: { id: line.warehouse_item_id },
          }
        );


        await db.purchaseOrderItemObj.update(
          {
            received_to_date: payload.received_at,
          },
          {
            where: { id: line.purchase_order_item_id },
          }
        );
      }


      const poLines = await db.poLineObj.findAll({
        where: { poId: payload.po_id },
      });

      let allReceived = true;

      for (const line of poLines) {
        const totalReceived =
          await db.purchaseOrderReceiptLineObj.sum("received_qty", {
            where: {
              po_line_id: line.id,
            },
          });

        if ((totalReceived || 0) < line.orderedQty) {
          allReceived = false;
          break;
        }
      }


      const newStatus = allReceived
        ? PURCHASE_ORDER_STATUS.CLOSED
        : PURCHASE_ORDER_STATUS.PARTIALLY_RECEIVED;

      await db.purchaseOrderObj.update(
        { status: newStatus },
        { where: { id: payload.po_id } }
      );

      return receiptHeader;
    } catch (err) {
      throw err;
    }
  },


  // async getVendorPOForReceipt(po_id) {
  //   try {
  //     const purchaseOrders = await db.purchaseOrderObj.findAll({
  //       where: { po_id },
  //       include: [
  //         {
  //           model: db.purchaseOrderReceiptHeaderObj,
  //           as: "receiptHeader",
  //           required: false,
  //           include: [
  //             {
  //               model: db.purchaseOrderReceiptLineObj,
  //               as: "receiptLines",
  //               include: [
  //                 {
  //                   model: db.purchaseOrderItemObj,
  //                   as: "purchaseOrderItem",
  //                   include: [
  //                     {
  //                       model: db.warehouseItemsObj,
  //                       as: "warehouseItem"
  //                     }
  //                   ]
  //                 }
  //               ],
  //             }
  //           ],

  //         },
  //       ],
  //       order: [["id", "DESC"]],
  //     });

  //     return purchaseOrders;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  async getVendorPOForReceipt(po_id) {
    try {
      const purchaseOrder = await db.purchaseOrderObj.findOne({
        where: { id: po_id },
        include: [
          {
            model: db.poHeaderObj,
            as: "header",
            required: false,
          },
          {
            model: db.poLineObj,
            as: "lines",
            required: false,
            include: [
              {
                model: db.purchaseOrderReceiptLineObj,
                as: "receiptLines",
                required: false,
              },
              {
                model: db.warehouseItemsObj,
                as: "warehouseItemData",
              }
            ],
          },
          {

            model: db.purchaseOrderItemObj,
            as: "purchaseOrderItems",
            required: false,
          },
          {
            model: db.vendorsObj,
            as: "vendorDetails",
          },
          {
            model: db.wareHouseObj,
            as: "warehouseDetails",
          },

        ],

        order: [
          ["id", "DESC"]
        ]
      });

      if (!purchaseOrder) {
        throw new Error("Purchase Order not found");
      }

      return purchaseOrder;

    } catch (error) {
      throw error;
    }
  },
  // async getVendorPOForReceipt(po_id) {
  //   try {
  //     const po = await db.purchaseOrderObj.findOne({
  //       where: { id: po_id },

  //       include: [
  //         {
  //           model: db.purchaseOrderItemObj,
  //           as: "purchaseOrderItem",
  //         },

  //       ],
  //     });

  //     if (!po) throw new Error("PO not found");

  //     // Step 1: Calculate total received per item
  //     const receivedMap = {};

  //     po.receiptHeader?.forEach(header => {
  //       header.receiptLines?.forEach(line => {
  //         if (!receivedMap[line.po_item_id]) {
  //           receivedMap[line.po_item_id] = 0;
  //         }
  //         receivedMap[line.po_item_id] += Number(line.received_qty);
  //       });
  //     });

  //     // Step 2: Prepare line data (UI table)
  //     const lines = po.items.map((item, index) => {
  //       const ordered = Number(item.quantity);
  //       const received = receivedMap[item.id] || 0;

  //       return {
  //         line_no: index + 1,
  //         item_code: item.warehouseItem?.item_code,
  //         description: item.warehouseItem?.description,
  //         uom: item.warehouseItem?.uom,
  //         quantity_ordered: ordered,
  //         quantity_received: received,
  //         quantity_backorder: ordered - received,
  //       };
  //     });

  //     return {
  //       po_id: po.id,
  //       po_number: po.po_number,
  //       lines,
  //     };

  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async getAllInventory() {

  //   const inventory = await db.purchaseOrderReceiptHeaderObj.findAll({
  //     include: [
  //       {
  //         model: db.purchaseOrderReceiptLineObj,
  //         as: "lineItems",
  //       },
  //       {
  //         model: db.purchaseOrderObj,
  //         as: "purchaseOrdersData",
  //         include: [
  //         {
  //           model: db.userObj,
  //           as: "enteredUser",
  //           attributes: ["id", "name", "email"], 
  //         },
  //         {
  //           model: db.vendorsObj,
  //           as: "vendorDetails",
  //           attributes: ["id", "name", "email"], 
  //         },
  //         {
  //           model: db.wareHouseObj,
  //           as: "warehouseDetails",
  //           attributes: ["id", "name", "location"],
  //         }

  //       ]

  //       }

  //     ],

  //     order: [["id", "DESC"]],
  //   });

  //   return inventory;
  // },

  async getAllInventory({ page = 1, per_page = 10 }) {
    try {
      page = parseInt(page) || 1;
      per_page = parseInt(per_page) || 10;

      const limit = per_page;
      const offset = (page - 1) * limit;

      // Total count (lazy load ke liye zaroori)
      const total = await db.purchaseOrderReceiptHeaderObj.count();

      // Data fetch (existing logic same)
      const rows = await db.purchaseOrderReceiptHeaderObj.findAll({
        include: [
          {
            model: db.purchaseOrderReceiptLineObj,
            as: "lineItems",
          },
          {
            model: db.purchaseOrderObj,
            as: "purchaseOrdersData",
            include: [
              {
                model: db.userObj,
                as: "enteredUser",
                attributes: ["id", "name", "email"],
              },
              {
                model: db.vendorsObj,
                as: "vendorDetails",
                attributes: ["id", "name", "email"],
              },
              {
                model: db.wareHouseObj,
                as: "warehouseDetails",
                attributes: ["id", "name", "location"],
              }
            ]
          }
        ],
        limit,
        offset,
        order: [["id", "DESC"]],
      });

      // ---------- Lazy Load Meta ----------
      const current_count = rows.length;
      const loaded_till_now = offset + current_count;
      const remaining = Math.max(total - loaded_till_now, 0);
      const has_more = loaded_till_now < total;

      return {
        data: rows,
        meta: {
          page,
          limit,
          current_count,
          loaded_till_now,
          remaining,
          total,
          has_more,
        },
      };

    } catch (error) {
      throw error;
    }
  },

  async getInventoryById(id) {
    const inventory = await db.purchaseOrderReceiptHeaderObj.findOne({
      where: { id },
      include: [
        {
          model: db.purchaseOrderReceiptLineObj,
          as: "lineItems",
        },
      ],

      order: [["id", "DESC"]],
    });

    return inventory;
  },

  async deleteInventoryById(id) {

    try {

      const receipt = await db.purchaseOrderReceiptHeaderObj.findOne({
        where: { id }
      });
      await db.purchaseOrderReceiptLineObj.destroy({
        where: { receipt_id: id }

      });

      await db.purchaseOrderReceiptHeaderObj.destroy({
        where: { id }

      });

      return true;

    } catch (error) {
      throw error;
    }
  }





};
