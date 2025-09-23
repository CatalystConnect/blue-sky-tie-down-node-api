var express = require("express");
var router = express.Router();
const companyController = require("../controllers/company.controller");
var { authJwt } = require("../middleware");

// Create a new company
router.post("/company/addCompany", [authJwt.verifyToken], [companyController.validate("addCompany")], companyController.addCompany);
router.get("/company/getAllCompany",[authJwt.verifyToken],  companyController.getAllCompany);
router.get("/company/getCompanyById",[authJwt.verifyToken],  companyController.getCompanyById);
router.delete("/company/deleteCompany",[authJwt.verifyToken], companyController.deleteCompany);
router.put("/company/updateCompany",[authJwt.verifyToken], [companyController.validate("updateCompany")], companyController.updateCompany);

module.exports = router;
