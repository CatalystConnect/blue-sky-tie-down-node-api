var express = require("express");
var router = express.Router();
const controller = require("../controllers/lead.controller");
var { authJwt } = require("../middleware");
let { upload ,multiUpload } = require("../../../config/multer.config");


/*get all leads*/
router.get("/leads",[authJwt.verifyToken], controller.getAllLeads);

/*add leads*/
router.post("/leads",[authJwt.verifyToken],upload.none(), controller.addLead);

/*get lead by id*/
router.get("/getLeadById",[authJwt.verifyToken],  controller.getLeadById);

/*lead update by id*/
router.put("/leadUpdate",[authJwt.verifyToken],upload.none(),  controller.leadUpdate);

/*lead delete by id*/
router.delete("/leadDelete",[authJwt.verifyToken], [controller.validate("getLeadById")], controller.leadDelete);


/*get all leads notes */
router.post("/lead-notes/", [authJwt.verifyToken], upload.none(), controller.addLeadtNotes);

// List Project Notes
router.get("/lead-notes", [authJwt.verifyToken], controller.getAllLeadNotes);

// // Update Leadt Notes
router.put("/updateLeadNotes", [authJwt.verifyToken], upload.none(), controller.updateLeadNotes);

// // Delete Leadt Notes
router.delete("/deleteLeadNotes", [authJwt.verifyToken], controller.deleteLeadNotes);

// update-lead-team-member
router.put("/update-lead-team-member", [authJwt.verifyToken], controller.updateLeadTeamMember);

// get-lead-team-member-by-lead-id
router.get("/get-lead-team-members", [authJwt.verifyToken], controller.getLeadTeamMembers);

router.put("/update-lead-dcs", [authJwt.verifyToken], upload.none(), controller.updateLeadDcs); 

router.get("/getAllProjectDatatakeoffLead", [authJwt.verifyToken], controller.getAllProjectDatatakeoffLead);
router.put("/updateleadPriorty", [authJwt.verifyToken], controller.updateleadPriorty);


module.exports = router;
