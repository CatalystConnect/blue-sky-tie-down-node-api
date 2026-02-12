var express = require("express");
var router = express.Router();
const voucherController = require("../controllers/voucher.controller");
var { authJwt } = require("../middleware");
let { upload ,multiUpload } = require("../../../config/multer.config");



/*add voucher*/
router.post("/voucher/addVoucher",[authJwt.verifyToken], voucherController.addVoucher);
router.get("/voucher/getAllVouchers",[authJwt.verifyToken],voucherController.getAllVouchers);
router.get("/voucher/getVoucherById",[authJwt.verifyToken],voucherController.getVoucherById);
router.put("/voucher/updateVoucher",[authJwt.verifyToken],voucherController.updateVoucher);
router.delete("/voucher/deleteVoucher",[authJwt.verifyToken],voucherController.deleteVoucher);


module.exports = router;
