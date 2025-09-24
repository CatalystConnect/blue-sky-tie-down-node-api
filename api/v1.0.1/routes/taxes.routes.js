var express = require("express");
var router = express.Router();
const taxesController = require("../controllers/taxes.controller");
var { authJwt } = require("../middleware");

// Create a new taxes
router.post("/taxes", [authJwt.verifyToken], [taxesController.validate("addtaxes")], taxesController.addtaxes);
router.get("/taxes",[authJwt.verifyToken],  taxesController.getAllTaxes);
router.get("/getTaxesById",[authJwt.verifyToken],  taxesController.getTaxesById);
router.put("/updateTaxes",[authJwt.verifyToken], [taxesController.validate("updateTaxes")], taxesController.updateTaxes);
router.delete("/deleteTaxes",[authJwt.verifyToken], taxesController.deleteTaxes);

module.exports = router;
