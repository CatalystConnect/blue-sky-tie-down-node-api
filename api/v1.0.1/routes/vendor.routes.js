var express = require("express");
var router = express.Router();
const vendorController = require("../controllers/vendor.controller");
var { authJwt } = require("../middleware");


/*addVendors*/
router.post("/vendors/addVendors",[authJwt.verifyToken], [vendorController.validate("addVendors")],  vendorController.addVendors);
router.get("/vendors/getVendorsById",[authJwt.verifyToken],  vendorController.getVendorsById);
router.get("/vendors/getAllVendors",[authJwt.verifyToken],  vendorController.getAllVendors);
router.delete("/vendors/deleteVendors",[authJwt.verifyToken], vendorController.deleteVendors);
router.put("/vendors/updateVendors",[authJwt.verifyToken], [vendorController.validate("updateVendors")], vendorController.updateVendors);


module.exports = router;