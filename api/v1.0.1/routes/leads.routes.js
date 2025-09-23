var express = require("express");
var router = express.Router();
const controller = require("../controllers/lead.controller");
var { authJwt } = require("../middleware");
let { upload ,multiUpload } = require("../../../config/multer.config");


/*get all leads*/
router.get("/lead/getAllLeads",[authJwt.verifyToken], controller.getAllLeads);

/*add leads*/
router.post("/lead/addLead",[authJwt.verifyToken],multiUpload,[controller.validate("addLead")], controller.addLead);

/*get lead by id*/
router.get("/lead/getLeadById",[authJwt.verifyToken], [controller.validate("getLeadById")], controller.getLeadById);

/*lead update by id*/
router.put("/lead/leadUpdate",[authJwt.verifyToken],multiUpload, [controller.validate("getLeadById")], controller.leadUpdate);

/*lead delete by id*/
router.delete("/lead/leadDelete",[authJwt.verifyToken], [controller.validate("getLeadById")], controller.leadDelete);

/*addRoofMeasure*/
router.post("/lead/addRoofMeasure",[authJwt.verifyToken], [controller.validate("getLeadById")], controller.addRoofMeasure);

/*addRoofMeasure*/
router.put("/lead/updateRoofMeasure",[authJwt.verifyToken], [controller.validate("updateRoofMeasure")], controller.updateRoofMeasure);

/*roofMeasureList*/
router.get("/lead/roofMeasureList",[authJwt.verifyToken], controller.roofMeasureList);

/*getRoofMeasureByLeadId*/
router.get("/lead/getRoofMeasureByLeadId",[authJwt.verifyToken], [controller.validate("getRoofMeasureByLeadId")], controller.getRoofMeasureByLeadId);

/*getAllGenerateContractor*/
router.post("/lead/getAllGenerateContractor",[authJwt.verifyToken],  controller.getAllGenerateContractor);

/*sendContractMail*/
router.put("/lead/sendContractMail",[authJwt.verifyToken], controller.sendContractMail);

/*getAllCustomerQuote*/
router.get("/lead/getAllCustomerQuote", controller.getAllCustomerQuote);

/* acceptRejectStatusUpdate */
router.put("/lead/acceptRejectStatusUpdate", controller.acceptRejectStatusUpdate);

/*getAllLeadBySales*/
router.get("/sales-lead/getAllLeadBySales",[authJwt.verifyToken], controller.getAllLeadBySales);


module.exports = router;
