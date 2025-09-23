var express = require("express");
var router = express.Router();
const controller = require("../controllers/applyWorkOrder.controller");
var { authJwt } = require("../middleware");
let { upload } = require("../../../config/multer.config");


/*addApplyWorkOrder*/
router.post("/applyWorkOrder/addApplyWorkOrder",[authJwt.verifyToken],upload.single("image"),[controller.validate("addApplyWorkOrder")], controller.addApplyWorkOrder);

/*applyWorkOrder*/
router.get("/applyWorkOrder/getAllApplyWorkOrder",[authJwt.verifyToken], controller.getAllApplyWorkOrder);

/*getApplyWorkOrderById*/
router.get("/applyWorkOrder/getApplyWorkOrderById",[authJwt.verifyToken], [controller.validate("getApplyWorkOrderById")], controller.getApplyWorkOrderById);

/*updateAttributesById*/
router.put("/applyWorkOrder/updateApplyWorkOrderById",[authJwt.verifyToken], [controller.validate("getApplyWorkOrderById")],upload.single("image"), controller.updateApplyWorkOrderById);

/*deleteApplyWorkOrderById*/
router.delete("/applyWorkOrder/deleteApplyWorkOrderById",[authJwt.verifyToken], [controller.validate("getApplyWorkOrderById")], controller.deleteApplyWorkOrderById);

/*getContractorProposal*/
router.get("/applyWorkOrder/getContractorProposal",[authJwt.verifyToken],[controller.validate("getContractorProposal")],  controller.getContractorProposal);

/*acceptRejectProposal*/
router.put("/applyWorkOrder/acceptRejectProposal",[authJwt.verifyToken],[controller.validate("getContractorProposal")],  controller.acceptRejectProposal);

/*bidsOnWorkOrder*/
router.get("/applyWorkOrder/bidsOnWorkOrder",[authJwt.verifyToken],[controller.validate("bidsOnWorkOrder")],  controller.bidsOnWorkOrder);

module.exports = router;
