var express = require("express");
var router = express.Router();
const productTagsController = require("../controllers/productTags.controller");
var { authJwt } = require("../middleware");
let { upload } = require("../../../config/multer.config");
/*tags*/
router.post("/product-tags/addTags",[authJwt.verifyToken],upload.none(), [productTagsController.validate("addTags")], productTagsController.addTags);
router.get("/product-tags/getAllTags",[authJwt.verifyToken],  productTagsController.getAllTags);
router.get("/product-tags/getTagsById",[authJwt.verifyToken],  productTagsController.getTagsById);
router.delete("/product-tags/deleteTags",[authJwt.verifyToken], productTagsController.deleteTags);
router.put("/product-tags/updateTags",[authJwt.verifyToken],upload.none(),  [productTagsController.validate("updateTags")], productTagsController.updateTags);


module.exports = router;

