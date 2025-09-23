var express = require("express");
var router = express.Router();
const controller = require("../controllers/manufacturer.controller");
var { authJwt } = require("../middleware");
let { upload } = require("../../../config/multer.config");


/*addManufacturer*/
router.post("/manufacturer/addManufacturer",[authJwt.verifyToken], upload.single("image"), controller.addManufacturer);

/*getAllManufacturer*/
router.get("/manufacturer/getAllManufacturer",[authJwt.verifyToken], controller.getAllManufacturer);

/*getManufacturerById*/
router.get("/manufacturer/getManufacturerById",[authJwt.verifyToken], controller.validate("getManufacturerById"), controller.getManufacturerById);

/*updateManufacturerById*/
router.put("/manufacturer/updateManufacturerById",[authJwt.verifyToken], controller.validate("getManufacturerById"),upload.single("image"), controller.updateManufacturerById);

/*deleteManufacturerById*/
router.delete("/manufacturer/deleteManufacturerById",[authJwt.verifyToken], controller.validate("getManufacturerById"), controller.deleteManufacturerById);

module.exports = router;
