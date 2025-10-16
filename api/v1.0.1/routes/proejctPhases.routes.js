var express = require("express");
var router = express.Router();
const productPhasesController = require("../controllers/projectPhases.controller");
var { authJwt } = require("../middleware");
let { upload } = require("../../../config/multer.config");
/*productPhasesController*/
router.post("/productPhases/addProductPhases",[authJwt.verifyToken], productPhasesController.addProductPhases);
 router.get("/productPhases/getAllProductPhases",[authJwt.verifyToken],  productPhasesController.getAllProductPhases);
router.get("/productPhases/getProductPhasesById",[authJwt.verifyToken],  productPhasesController.getProductPhasesById);
router.delete("/productPhases/deleteproductPhases",[authJwt.verifyToken], productPhasesController.deleteproductPhases);
router.put("/productPhases/updateProductPhases",[authJwt.verifyToken], productPhasesController.updateProductPhases);


module.exports = router;

