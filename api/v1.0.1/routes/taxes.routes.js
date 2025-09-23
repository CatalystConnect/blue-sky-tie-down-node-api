var express = require("express");
var router = express.Router();
const taxesController = require("../controllers/taxes.controller");
var { authJwt } = require("../middleware");

// Create a new taxes
router.post("/taxes/addtaxes", [authJwt.verifyToken], [taxesController.validate("addtaxes")], taxesController.addtaxes);
router.get("/taxes/getAllTaxes",[authJwt.verifyToken],  taxesController.getAllTaxes);
router.get("/taxes/getTaxesById",[authJwt.verifyToken],  taxesController.getTaxesById);
router.delete("/taxes/deleteTaxes",[authJwt.verifyToken], taxesController.deleteTaxes);
router.put("/taxes/updateTaxes",[authJwt.verifyToken], [taxesController.validate("updateTaxes")], taxesController.updateTaxes);

module.exports = router;
