var express = require("express");
var router = express.Router();
const vendorItemController = require("../controllers/vendorItem.controller");
var { authJwt } = require("../middleware");
let { upload } = require("../../../config/multer.config");

/*addVendors*/
router.post("/vendors/addVendorsItem",[authJwt.verifyToken],  vendorItemController.addVendorsItem);
router.get("/vendors/getVendorsItemById",[authJwt.verifyToken],  vendorItemController.getVendorsItemById);
router.get("/vendors/getAllVendorsItem",[authJwt.verifyToken],  vendorItemController.getAllVendorsItem);
router.delete("/vendors/deleteVendorsItem",[authJwt.verifyToken], vendorItemController.deleteVendorsItem);
router.put("/vendors/updateVendorsItem",[authJwt.verifyToken],  vendorItemController.updateVendorsItem);
    
module.exports = router;