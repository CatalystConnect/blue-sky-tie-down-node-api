var express = require("express");
var router = express.Router();
const purchaseOrderController = require("../controllers/purchaseOrder.controller");
var { authJwt } = require("../middleware");

/*purchaseOrder*/
router.post("/purchaseOrder/addPurchaseOrder",[authJwt.verifyToken], purchaseOrderController.addPurchaseOrder);
router.post("/purchaseOrder/sendPurchaseOrder",[authJwt.verifyToken],purchaseOrderController.sendPurchaseOrder);
router.post("/purchaseOrderReceipt/addPOReceipt",[authJwt.verifyToken], purchaseOrderController.addPOReceipt);



module.exports = router;