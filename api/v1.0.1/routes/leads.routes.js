var express = require("express");
var router = express.Router();
const controller = require("../controllers/lead.controller");
var { authJwt } = require("../middleware");
let { upload ,multiUpload } = require("../../../config/multer.config");


/*get all leads*/
router.get("/leads",[authJwt.verifyToken], controller.getAllLeads);

/*add leads*/
router.post("/leads",[authJwt.verifyToken],upload.none(),[controller.validate("addLead")], controller.addLead);

/*get lead by id*/
router.get("/getLeadById",[authJwt.verifyToken], [controller.validate("getLeadById")], controller.getLeadById);

/*lead update by id*/
router.put("/leadUpdate",[authJwt.verifyToken],upload.none(), [controller.validate("getLeadById")], controller.leadUpdate);

/*lead delete by id*/
router.delete("/leadDelete",[authJwt.verifyToken], [controller.validate("getLeadById")], controller.leadDelete);


/*get all leads notes */
router.post("/lead-notes/", [authJwt.verifyToken], controller.addLeadtNotes);

// List Project Notes
router.get("/lead-notes", [authJwt.verifyToken], controller.getAllLeadNotes);

// // Update Leadt Notes
router.put("/updateLeadNotes", [authJwt.verifyToken], controller.updateLeadNotes);

// // Delete Leadt Notes
router.delete("/deleteLeadNotes", [authJwt.verifyToken], controller.deleteLeadNotes);

module.exports = router;
