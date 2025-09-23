var express = require("express");
var router = express.Router();
const controller = require("../controllers/productAttribute.controller");
var { authJwt } = require("../middleware");

/*addProductAttribute*/
router.post("/productAttribute/addProductAttribute",[authJwt.verifyToken], controller.addProductAttribute);

/*getAllAttributes*/
router.get("/productAttribute/getAllProductAttributes",[authJwt.verifyToken], controller.getAllProductAttributes);

/*getAttributesById*/
router.get("/productAttribute/getProductAttributesById",[authJwt.verifyToken], [controller.validate("getProductAttributesById")], controller.getProductAttributesById);

/*updateProductAttributesById*/
router.put("/productAttribute/updateProductAttributesById",[authJwt.verifyToken], [controller.validate("getProductAttributesById")], controller.updateProductAttributesById);

/*updateAttributesById*/
router.delete("/productAttribute/deleteProductAttributesById",[authJwt.verifyToken], [controller.validate("getProductAttributesById")], controller.deleteProductAttributesById);

/*getAttributesByProductId*/
router.get("/productAttribute/getAttributesByProductId",[authJwt.verifyToken], [controller.validate("getAttributesByProductId")], controller.getAttributesByProductId);

module.exports = router;
