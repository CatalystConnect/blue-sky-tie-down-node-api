var express = require("express");
var router = express.Router();
const unitController = require("../controllers/units.controller");
var { authJwt } = require("../middleware");


/*addUnits*/
router.post("/units/addUnits",[authJwt.verifyToken], [unitController.validate("addUnits")], unitController.addUnits);
router.get("/units/getAddUnits",[authJwt.verifyToken],  unitController.getAddUnits);
router.get("/units/getUnitById",[authJwt.verifyToken],  unitController.getUnitById);
router.delete("/units/deleteUnits",[authJwt.verifyToken], unitController.deleteUnits);
router.put("/units/updateUnits",[authJwt.verifyToken], [unitController.validate("updateUnits")],  unitController.updateUnits);


module.exports = router;

