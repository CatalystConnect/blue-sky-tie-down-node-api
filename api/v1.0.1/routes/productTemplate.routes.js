var express = require("express");
var router = express.Router();
const productTemplateController = require("../controllers/productTemplate.controller");
var { authJwt } = require("../middleware");
let { upload } = require("../../../config/multer.config");

/*addRole*/
router.post("/productTemplate/addProductTemplate",[authJwt.verifyToken],  productTemplateController.addProductTemplate);
router.get("/productTemplate/getAllProductTemplate",[authJwt.verifyToken],productTemplateController.getAllProductTemplate);
router.get("/productTemplate/getProductTemplateById",[authJwt.verifyToken],productTemplateController.getProductTemplateById);
router.put("/productTemplate/updateProductTemplate",[authJwt.verifyToken],productTemplateController.updateProductTemplate);
router.delete("/productTemplate/deleteProductTemplate",[authJwt.verifyToken],productTemplateController.deleteProductTemplate);

module.exports = router;