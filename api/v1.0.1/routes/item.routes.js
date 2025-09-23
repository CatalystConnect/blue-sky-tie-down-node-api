var express = require("express");
var router = express.Router();
const itemController = require("../controllers/item.controller");
var { authJwt } = require("../middleware");
let { upload ,multiUpload } = require("../../../config/multer.config");
/*items*/
router.post("/items/addItems",[authJwt.verifyToken], multiUpload, itemController.addItems);
router.get("/items/getAllItems",[authJwt.verifyToken],  itemController.getAllItems);
router.get("/items/getItemsById",[authJwt.verifyToken],  itemController.getItemsById);
router.delete("/items/deleteItems",[authJwt.verifyToken], itemController.deleteItems);
router.put("/items/updateItems",[authJwt.verifyToken], multiUpload, itemController.updateItems);


module.exports = router;

