var express = require("express");
var router = express.Router();
const vendorAddressController = require("../controllers/vendorAddress.controller");
var { authJwt } = require("../middleware");
let { upload } = require("../../../config/multer.config");

/*addVendors*/
router.post("/vendors/addVendorsAddress",[authJwt.verifyToken],  vendorAddressController.addVendorsAddress);
router.get("/vendors/getVendorsAddressById",[authJwt.verifyToken],  vendorAddressController.getVendorsAddressById);
router.get("/vendors/getAllVendorsAddress",[authJwt.verifyToken],  vendorAddressController.getAllVendorsAddress);
router.delete("/vendors/deleteVendorsAddress",[authJwt.verifyToken], vendorAddressController.deleteVendorsAddress);
router.put("/vendors/updateVendorsAddress",[authJwt.verifyToken],  vendorAddressController.updateVendorsAddress);
    
module.exports = router;