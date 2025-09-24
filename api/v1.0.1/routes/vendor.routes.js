var express = require("express");
var router = express.Router();
const vendorController = require("../controllers/vendor.controller");
var { authJwt } = require("../middleware");
let { upload } = require("../../../config/multer.config");

/*addVendors*/
router.post("/vendors/addVendors",[authJwt.verifyToken], upload.none(),[vendorController.validate("addVendors")],  vendorController.addVendors);
router.get("/vendors/getVendorsById",[authJwt.verifyToken],  vendorController.getVendorsById);
router.get("/vendors/getAllVendors",[authJwt.verifyToken],  vendorController.getAllVendors);
router.delete("/vendors/deleteVendors",[authJwt.verifyToken], vendorController.deleteVendors);
router.put("/vendors/updateVendors",[authJwt.verifyToken], upload.none(), [vendorController.validate("updateVendors")], vendorController.updateVendors);


module.exports = router;