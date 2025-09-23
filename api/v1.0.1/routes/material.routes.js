var express = require("express");
var router = express.Router();
const controller = require("../controllers/material.controller");
var { authJwt } = require("../middleware");

/*addMaterial*/
router.post("/material/addMaterial",[authJwt.verifyToken],[controller.validate("addMaterial")], controller.addMaterial);

/*getMaterialList*/
router.get("/material/getMaterialList",[authJwt.verifyToken], controller.getMaterialList);

/*getMaterialById*/
router.get("/material/getMaterialById",[authJwt.verifyToken], [controller.validate("getMaterialById")], controller.getMaterialById);

/*updateMaterial*/
router.put("/material/updateMaterial",[authJwt.verifyToken], [controller.validate("getMaterialById")], controller.updateMaterial);

/*deleteMaterial*/
router.delete("/material/deleteMaterial",[authJwt.verifyToken], [controller.validate("getMaterialById")], controller.deleteMaterial);

/*deleteMaterial*/
router.delete("/material/deleteMaterial",[authJwt.verifyToken], [controller.validate("getMaterialById")], controller.deleteMaterial);

/*sendMaterialQuotePdf*/
router.get("/material/sendMaterialQuotePdf",[authJwt.verifyToken], [controller.validate("getMaterialById")], controller.sendMaterialQuotePdf);

/*materialQuoteStatusUpdate*/
router.post("/material/materialQuoteStatusUpdate",[authJwt.verifyToken], [controller.validate("materialQuoteStatusUpdate")], controller.materialQuoteStatusUpdate);

/*getMaterialDetailById*/
router.get("/material/getMaterialDetailById",[authJwt.verifyToken], [controller.validate("getMaterialById")], controller.getMaterialDetailById);

module.exports = router;
