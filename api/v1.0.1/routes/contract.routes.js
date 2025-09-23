var express = require("express");
var router = express.Router();
const controller = require("../controllers/contract.controller");
var { authJwt } = require("../middleware");
let { upload, multiUpload } = require("../../../config/multer.config");


/*register*/
router.post("/contract/addContract", upload.single("logo"),[controller.validate("addContract")], controller.addContract);

/*getAllContract*/
router.get("/contract/getAllContract",[authJwt.verifyToken], controller.getAllContract);

/*updateContract*/
router.put("/contract/updateContract",[authJwt.verifyToken],upload.single("logo"), [controller.validate("updateContract")], controller.updateContract);

/*deleteContract*/
router.delete("/contract/deleteContract",[authJwt.verifyToken], [controller.validate("updateContract")], controller.deleteContract);

/*getContractById*/
router.get("/contract/getContractById",[authJwt.verifyToken], [controller.validate("updateContract")], controller.getContractById);

/*getContractById*/
router.post("/contract/bulkCreateContract",[authJwt.verifyToken], upload.any("logo"), controller.bulkContract);

/*importCvc*/
router.post("/contract/importCvc",[authJwt.verifyToken], upload.any("file"), controller.importCsv);

/*addContractRegion*/
router.post("/contract/addContractRegion",[authJwt.verifyToken],[controller.validate("addContractRegion")], controller.addContractRegion);

/*getAllContractRegion*/
router.get("/contract/getAllContractRegion",[authJwt.verifyToken], controller.getAllContractRegion);

/*contractRegionById*/
router.get("/contract/contractRegionById",[authJwt.verifyToken],[controller.validate("contractRegionById")], controller.contractRegionById);

/*contractRegionUpdate*/
router.put("/contract/contractRegionUpdate",[authJwt.verifyToken],[controller.validate("contractRegionById")], controller.contractRegionUpdate);

/*deleteContractRegion*/
router.delete("/contract/deleteContractRegion",[controller.validate("contractRegionById")], controller.deleteContractRegion);

/*getRegionByZipCode*/
router.get("/contract/getRegionByZipCode",[authJwt.verifyToken], [controller.validate("getRegionByZipCode")], controller.getRegionByZipCode);

/*mergeContracts*/
router.put("/contract/mergeContracts",[authJwt.verifyToken], controller.mergeContracts);

/*subContractorVerification*/
router.post("/contract/addSubContractorVerification",[authJwt.verifyToken], multiUpload, controller.addSubContractorVerification);

/*getContractorVerification*/
router.get("/contract/getContractorVerification",[authJwt.verifyToken],[controller.validate("updateContract")], controller.getContractorVerification);

/*getContractorVerification*/
router.get("/contract/getRejectContractorVerification",[authJwt.verifyToken], controller.getRejectContractorVerification);

/*updateContractorVerification*/
router.put("/contract/updateContractorVerification",[authJwt.verifyToken],[controller.validate("updateContractorVerification")], controller.updateContractorVerification);

/*getDocumentLink*/
router.get("/contract/getDocumentLink",[authJwt.verifyToken], [controller.validate("updateContract")], controller.getDocumentLink);

/*addLeadInteraction*/
router.post("/contract/addLeadInteraction",[authJwt.verifyToken], controller.addLeadInteraction);

/*getAllLeadInteraction*/
router.get("/contract/getAllLeadInteraction",[authJwt.verifyToken], controller.getAllLeadInteraction);

/*getLeadInteractionByContractId*/
router.get("/contract/getLeadInteractionByContractId",[authJwt.verifyToken], [controller.validate("getLeadInteractionByContractId")], controller.getLeadInteractionByContractId);

/*getDuplicateContracts*/
router.get("/contract/getDuplicateContracts",[authJwt.verifyToken], controller.getDuplicateContracts);

/*forgotPasswordRequested*/
router.post("/contract/forgotPasswordRequest",[authJwt.verifyToken],[controller.validate("forgotPasswordRequested")], controller.forgotPasswordRequested);

/*resetPassword*/
router.post("/contract/resetPassword",[authJwt.verifyToken],[controller.validate("resetPassword")], controller.resetPassword);


router.get("/contract/getGenerateContractor",[authJwt.verifyToken], controller.getGenerateContractor);
router.get("/contract/getGenerateContractorById",[authJwt.verifyToken],controller.getGenerateContractorById);
router.put("/contract/updateGenerateContractorStatus",[authJwt.verifyToken],controller.updateGenerateContractorStatus);
 
router.put("/customer/updateCustomerSignature",[authJwt.verifyToken],upload.single("customerSignature"),controller.updateCustomerSignature);
router.put("/contract/updateContractNotes",[authJwt.verifyToken],controller.updateContractNotes);


module.exports = router;
