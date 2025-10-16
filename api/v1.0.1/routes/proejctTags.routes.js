var express = require("express");
var router = express.Router();
const productTagsController = require("../controllers/projectTags.controller");
var { authJwt } = require("../middleware");
let { upload } = require("../../../config/multer.config");
/*productPhasesController*/
router.post("/productTags/addProductTags",[authJwt.verifyToken], productTagsController.addProductTags);
 router.get("/productTags/getAllProductTags",[authJwt.verifyToken],  productTagsController.getAllProductTags);
router.get("/productTags/getProductTagsById",[authJwt.verifyToken],  productTagsController.getProductTagsById);
router.delete("/productTags/deleteProductTags",[authJwt.verifyToken], productTagsController.deleteProductTags);
router.put("/productTags/updateProductTags",[authJwt.verifyToken], productTagsController.updateProductTags);


module.exports = router;

