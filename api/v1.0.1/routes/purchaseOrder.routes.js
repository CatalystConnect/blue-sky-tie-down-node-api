var express = require("express");
var router = express.Router();
const purchaseOrderController = require("../controllers/purchaseOrder.controller");
var { authJwt } = require("../middleware");

/*purchaseOrder*/
router.post("/purchaseOrder/addPurchaseOrder",[authJwt.verifyToken], purchaseOrderController.addPurchaseOrder);
router.post("/purchaseOrder/submitApprovePurchaseOrder",[authJwt.verifyToken],purchaseOrderController.submitApprovePurchaseOrder);
router.post("/purchaseOrder/rejectPurchaseOrder",[authJwt.verifyToken], purchaseOrderController.rejectPurchaseOrder);
router.post("/purchaseOrder/sendPurchaseOrder",[authJwt.verifyToken],purchaseOrderController.sendPurchaseOrder);
router.post("/purchaseOrderReceipt/addPOReceipt",[authJwt.verifyToken], purchaseOrderController.addPOReceipt);
router.post("/purchaseOrder/close",[authJwt.verifyToken],purchaseOrderController.closePurchaseOrder);

router.get("/getPurchaseOrder",[authJwt.verifyToken],purchaseOrderController.getPurchaseOrder);
router.get("/purchaseOrder/getPurchaseOrders",[authJwt.verifyToken],purchaseOrderController.getPurchaseOrders);
router.get("/purchaseOrder/getPurchaseOrderById",[authJwt.verifyToken],purchaseOrderController.getPurchaseOrderById);
router.put("/purchaseOrder/updatePurchaseOrder",[authJwt.verifyToken],purchaseOrderController.updatePurchaseOrder);
router.delete("/purchaseOrder/deletePurchaseOrder",[authJwt.verifyToken],purchaseOrderController.deletePurchaseOrder);

router.put("/purchaseOrder/updatePurchaseOrderStatus",[authJwt.verifyToken],purchaseOrderController.updatePurchaseOrderStatus);
router.post("/purchaseOrder/createReceiptPurchaseOrder",[authJwt.verifyToken],purchaseOrderController.createReceiptPurchaseOrder);
router.get("/purchaseOrder/getVendorPOForReceipt",[authJwt.verifyToken],purchaseOrderController.getVendorPOForReceipt);

router.get("/purchaseOrder/getAllInventory",[authJwt.verifyToken],purchaseOrderController.getAllInventory);
router.get("/purchaseOrder/getInventoryById",[authJwt.verifyToken],purchaseOrderController.getInventoryById);

router.delete("/purchaseOrder/deleteInventoryById",[authJwt.verifyToken],purchaseOrderController.deleteInventoryById);

router.get("/lastPurchase/getLastPurchaseOrder",[authJwt.verifyToken],purchaseOrderController.getLastPurchaseOrder);
router.get("/purchaseOrder/getPurchaseOrderReceipt",[authJwt.verifyToken],purchaseOrderController.getPurchaseOrderReceipt);


router.get("/purchaseOrder/getAllReciverItem",purchaseOrderController.getAllReciverItemPO);

module.exports = router;