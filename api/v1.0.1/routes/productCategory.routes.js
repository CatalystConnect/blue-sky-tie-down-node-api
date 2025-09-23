var express = require("express");
var router = express.Router();
const controller = require("../controllers/productCategory.controller");
var { authJwt } = require("../middleware");
let { upload } = require("../../../config/multer.config");


/*addProductAttribute*/
router.post("/productCategory/addProductCategory",[authJwt.verifyToken],upload.single("image"),[controller.validate("addProductCategory")], controller.addProductCategory);

/*getAllAttributes*/
router.get("/productCategory/getAllProductCategory",[authJwt.verifyToken], controller.getAllProductCategory);

/*getAttributesById*/
router.get("/productCategory/getProductCategoryById",[authJwt.verifyToken], [controller.validate("getProductCategoryById")], controller.getProductCategoryById);

/*updateProductAttributesById*/
router.put("/productCategory/updateProductCategoryById",[authJwt.verifyToken], [controller.validate("getProductCategoryById")],upload.single("image"), controller.updateProductCategoryById);

/*updateAttributesById*/
router.delete("/productCategory/deleteProductCategoryById",[authJwt.verifyToken], [controller.validate("getProductCategoryById")], controller.deleteProductCategoryById);

/*getAllCategoryWithProduct*/
router.get("/productCategory/getAllCategoryWithProduct",[authJwt.verifyToken], controller.getAllCategoryWithProduct);

/*getProductByCategoryId*/
router.get("/productCategory/getProductByCategoryId",[authJwt.verifyToken],[controller.validate("getProductByCategoryId")], controller.getProductByCategoryId);

/*getVariationByCategoryId*/
router.get("/productCategory/getVariationByCategoryId",[authJwt.verifyToken],[controller.validate("getProductByCategoryId")], controller.getVariationByCategoryId);

module.exports = router;
