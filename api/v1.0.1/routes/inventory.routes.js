var express = require("express");
var router = express.Router();
const controller = require("../controllers/inventory.controller");
var { authJwt } = require("../middleware");
let { upload } = require("../../../config/multer.config");


/*addInventory*/
router.post("/inventory/addInventory",[authJwt.verifyToken], upload.fields([
    { name: "image", maxCount: 1 },
    { name: "productGallery", maxCount: 5 }
]), controller.addInventory);

/*getAllInventory*/
router.get("/inventory/getAllInventory", [authJwt.verifyToken], controller.getAllInventory);

/*getAllInventory*/
router.get("/inventory/getInventoryById", [authJwt.verifyToken],[controller.validate("getInventoryById")], controller.getInventoryById);

/*updateUser*/
router.put("/inventory/updateInventorById", [authJwt.verifyToken],[controller.validate("getInventoryById")],upload.fields([
    { name: "image", maxCount: 1 },
    { name: "productGallery", maxCount: 5 }
]), controller.updateInventorById);

/*deleteInventory*/
router.delete("/inventory/deleteInventory", [authJwt.verifyToken],[controller.validate("getInventoryById")], controller.deleteInventory);


module.exports = router;
