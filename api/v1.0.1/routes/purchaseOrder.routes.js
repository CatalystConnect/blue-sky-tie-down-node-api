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


module.exports = router;