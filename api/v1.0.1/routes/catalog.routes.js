var express = require("express");
var router = express.Router();
const controller = require("../controllers/catalog.controller");
var { authJwt } = require("../middleware");
let { upload } = require("../../../config/multer.config");


/*addCatalog*/
router.post("/catalog/addCatalog",[authJwt.verifyToken], [controller.validate("addCatalog")],upload.fields([{ name: "featureImage" }, { name: "thumbnail" }]), controller.addCatalog);

/*getAllCatalog*/
router.get("/catalog/getAllCatalog",[authJwt.verifyToken], controller.getAllCatalog);

/*getCatalogById*/
router.get("/catalog/getCatalogById",[authJwt.verifyToken], [controller.validate("getCatalogById")],controller.getCatalogById);

/*updateCatalogById*/
router.put("/catalog/updateCatalogById",[authJwt.verifyToken], [controller.validate("getCatalogById")],upload.fields([{ name: "featureImage" }, { name: "thumbnail" }]),controller.updateCatalogById);

/*deleteCatalogById*/
router.delete("/catalog/deleteCatalogById",[authJwt.verifyToken], [controller.validate("getCatalogById")],controller.deleteCatalogById);

module.exports = router;
