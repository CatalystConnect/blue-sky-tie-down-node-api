var express = require("express");
var router = express.Router();
const wareHuseController = require("../controllers/warehouse.controller");
var { authJwt } = require("../middleware");
let { upload } = require("../../../config/multer.config");
/*WareHouse */
router.post("/wareHouse/addWareHouse",[authJwt.verifyToken], upload.none(),[wareHuseController.validate("addWareHouse")], wareHuseController.addWareHouse);
router.get("/wareHouse/getAllWareHouse",[authJwt.verifyToken],  wareHuseController.getAllWareHouse);
router.get("/wareHouse/getWareHouseById",[authJwt.verifyToken],  wareHuseController.getWareHouseById);
router.delete("/wareHouse/deleteWareHouse",[authJwt.verifyToken], wareHuseController.deleteWareHouse);
router.put("/wareHouse/updateWareHouse",[authJwt.verifyToken], upload.none(), [wareHuseController.validate("updateWareHouse")], wareHuseController.updateWareHouse);


module.exports = router;

