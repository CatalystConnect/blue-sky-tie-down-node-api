var express = require("express");
var router = express.Router();
const vendorContactController = require("../controllers/vendorContact.controller");
var { authJwt } = require("../middleware");
let { upload } = require("../../../config/multer.config");

/*addVendors*/
router.post("/vendors/addVendorsContact",[authJwt.verifyToken],  vendorContactController.addVendorsContact);
router.get("/vendors/getVendorsContactById",[authJwt.verifyToken],  vendorContactController.getVendorsContactById);
router.get("/vendors/getAllVendorsContact",[authJwt.verifyToken],  vendorContactController.getAllVendorsContact);
router.delete("/vendors/deleteVendorsContact",[authJwt.verifyToken], vendorContactController.deleteVendorsContact);
router.put("/vendors/updateVendorsContact",[authJwt.verifyToken],  vendorContactController.updateVendorsContact);
    
module.exports = router;