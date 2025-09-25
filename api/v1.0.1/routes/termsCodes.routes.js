var express = require("express");
var router = express.Router();
const termsCodesController = require("../controllers/termsCodes.controller");
var { authJwt } = require("../middleware");
let { upload } = require("../../../config/multer.config");

/*Terms*/
router.post("/terms",[authJwt.verifyToken], upload.none(), termsCodesController.addTerms);
router.get("/terms", [authJwt.verifyToken],termsCodesController.getAllTerms);
router.get("/getTermsById",[authJwt.verifyToken],  termsCodesController.getTermsById);
router.delete("/deleteTerms", [authJwt.verifyToken], termsCodesController.deleteTerms);
router.put("/updateTerms", [authJwt.verifyToken], upload.none(), termsCodesController.updateTerms);


module.exports = router;