var express = require("express");
var router = express.Router();
const companyTypeController = require("../controllers/companyType.controller");
var { authJwt } = require("../middleware");

// Create a new company type
router.post("/company-types", [authJwt.verifyToken], [companyTypeController.validate("addCompanyType")], companyTypeController.addCompanyType);
router.get("/company-types",[authJwt.verifyToken],  companyTypeController.getAllCompanyType);
router.get("/getCompanyTypeById",[authJwt.verifyToken],  companyTypeController.getCompanyTypeById);
router.delete("/deleteCompanyType",[authJwt.verifyToken], companyTypeController.deleteCompanyType);
router.put("/updateCompanyType",[authJwt.verifyToken], [companyTypeController.validate("updateCompanyType")], companyTypeController.updateCompanyType);

module.exports = router;
