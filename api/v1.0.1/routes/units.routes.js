var express = require("express");
var router = express.Router();
const unitController = require("../controllers/units.controller");
var { authJwt } = require("../middleware");
let { upload } = require("../../../config/multer.config");

/*addUnits*/
router.post("/units/addUnits",[authJwt.verifyToken], upload.none(),[unitController.validate("addUnits")], unitController.addUnits);
router.get("/units/getAllAddUnits",[authJwt.verifyToken],  unitController.getAllAddUnits);
router.get("/units/getUnitById",[authJwt.verifyToken],  unitController.getUnitById);
router.delete("/units/deleteUnits",[authJwt.verifyToken], unitController.deleteUnits);
router.put("/units/updateUnits",[authJwt.verifyToken],upload.none(), [unitController.validate("updateUnits")],  unitController.updateUnits);


module.exports = router;

