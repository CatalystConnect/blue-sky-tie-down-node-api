var express = require("express");
var router = express.Router();
const controller = require("../controllers/workOrder.controller");
var { authJwt } = require("../middleware");
let { upload } = require("../../../config/multer.config");


/*addOrder*/
router.post("/workOrder/addWorkOrder", [authJwt.verifyToken],upload.array("image", 5),[controller.validate("addWorkOrder")], controller.addWorkOrder);

/*getAllOrder*/
router.get("/workOrder/getAllWorkOrder",[authJwt.verifyToken], controller.getAllWorkOrder);

/*getOrderById*/
router.get("/workOrder/getWorkOrderById",[authJwt.verifyToken], [controller.validate("getOrderById")], controller.getWorkOrderById);

/*updateOrder*/
router.put("/workOrder/updateWorkOrder",[authJwt.verifyToken], [controller.validate("getOrderById")],upload.array("image", 5), controller.updateWorkOrder);

/*deleteOrder*/
router.delete("/workOrder/deleteWorkOrder",[authJwt.verifyToken], [controller.validate("getOrderById")], controller.deleteWorkOrder);

/*deleteImage*/
router.delete("/workOrder/deleteImage",[authJwt.verifyToken], [controller.validate("deleteImage")], controller.deleteImage);

/*addWorkCategory*/
router.post("/workOrder/addWorkCategory",[authJwt.verifyToken], [controller.validate("addWorkCategory")], controller.addWorkCategory);

/*getAllWorkCategory*/
router.get("/workOrder/getAllWorkCategory",[authJwt.verifyToken], controller.getAllWorkCategory);

/*getWorkCategoryById*/
router.get("/workOrder/getWorkCategoryById",[authJwt.verifyToken],  [controller.validate("getWorkCategoryById")], controller.getWorkCategoryById);

/*updateWorkCategory*/
router.put("/workOrder/updateWorkCategory",[authJwt.verifyToken],  [controller.validate("getWorkCategoryById")], controller.updateWorkCategory);

/*deleteWorkCategory*/
router.delete("/workOrder/deleteWorkCategory",[authJwt.verifyToken],  [controller.validate("getWorkCategoryById")], controller.deleteWorkCategory);

/*getRegionByZipCode*/
router.get("/workOrder/getRegionByZipCode",[authJwt.verifyToken], [controller.validate("getRegionByZipCode")], controller.getRegionByZipCode);



module.exports = router;

