var express = require("express");
var router = express.Router();
const productCategoriesController = require("../controllers/productCategories.controller");
var { authJwt } = require("../middleware");

/*productCategories*/
router.post("/productCategories/addProductCategories",[authJwt.verifyToken],  productCategoriesController.addProductCategories);
router.get("/productCategories/getAllProductCategories",[authJwt.verifyToken],  productCategoriesController.getAllProductCategories);
router.get("/productCategories/getProductCategoriesById",[authJwt.verifyToken],  productCategoriesController.getProductCategoriesById);
router.delete("/productCategories/deleteProductCategories",[authJwt.verifyToken], productCategoriesController.deleteProductCategories);
router.put("/productCategories/updateProductCategories",[authJwt.verifyToken],  productCategoriesController.updateProductCategories);


module.exports = router;

