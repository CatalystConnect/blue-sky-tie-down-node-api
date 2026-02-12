var express = require("express");
var router = express.Router();
const InvoiceController = require("../controllers/invoice.controller");
var { authJwt } = require("../middleware");
let { upload ,multiUpload } = require("../../../config/multer.config");



/*add Invoice*/
router.post("/invoice/addInnvoiceVendor",[authJwt.verifyToken], InvoiceController.addInnvoiceVendor);




module.exports = router;
