var express = require("express");
var router = express.Router();
const companyTypeController = require("../controllers/companyType.controller");
var { authJwt } = require("../middleware");

// Create a new company type
router.post("/company-type/addCompanyType", [authJwt.verifyToken], [companyTypeController.validate("addCompanyType")], companyTypeController.addCompanyType);
router.get("/company-type/getAllCompanyType",[authJwt.verifyToken],  companyTypeController.getAllCompanyType);
router.get("/company-type/getCompanyTypeById",[authJwt.verifyToken],  companyTypeController.getCompanyTypeById);
router.delete("/company-type/deleteCompanyType",[authJwt.verifyToken], companyTypeController.deleteCompanyType);
router.put("/company-type/updateCompanyType",[authJwt.verifyToken], [companyTypeController.validate("updateCompanyType")], companyTypeController.updateCompanyType);

module.exports = router;
