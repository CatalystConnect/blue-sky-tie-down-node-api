var express = require("express");
var router = express.Router();
const companyController = require("../controllers/company.controller");
var { authJwt } = require("../middleware");
let { upload } = require("../../../config/multer.config");


// Create a new company
router.post("/companies", [authJwt.verifyToken], upload.none(), [companyController.validate("addCompany")],  companyController.addCompany);
router.get("/companies",[authJwt.verifyToken],  companyController.getAllCompany);
router.get("/getCompanyById",[authJwt.verifyToken],  companyController.getCompanyById);
router.delete("/deleteCompany",[authJwt.verifyToken], companyController.deleteCompany);
router.put("/updateCompany",[authJwt.verifyToken], upload.none(), [companyController.validate("updateCompany")], companyController.updateCompany);

module.exports = router;
