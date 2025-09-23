var express = require("express");
var router = express.Router();
const wareHuseItemsController = require("../controllers/warehouseItems.controller");
var { authJwt } = require("../middleware");

/*WareHouseItem */
router.post("/wareHouseItems/addWareHouseItems",[authJwt.verifyToken], wareHuseItemsController.addwareHouseItems);
router.get("/wareHouseItems/getWareHouseItemById",[authJwt.verifyToken],  wareHuseItemsController.getWareHouseItemById);
router.get("/wareHouseItems/getAllWareHouseItems",[authJwt.verifyToken],  wareHuseItemsController.getAllWareHouseItems);
router.delete("/wareHouseItems/deleteWareHouseItems",[authJwt.verifyToken], wareHuseItemsController.deletewareHouseItems);
router.put("/wareHouseItems/updateWareHouseItems",[authJwt.verifyToken],  wareHuseItemsController.updateWareHouseItems);


module.exports = router;
