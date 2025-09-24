var express = require("express");
var router = express.Router();
const leadTeamsController = require("../controllers/leadTeams.controller");
var { authJwt } = require("../middleware");
let { upload } = require("../../../config/multer.config");

/*leadTeams*/
router.post("/lead-teams",[authJwt.verifyToken], upload.none(), leadTeamsController.addLeadTeams);
router.get("/lead-teams", [authJwt.verifyToken],leadTeamsController.getAllLeadTeams);
router.get("/getLeadTeamsById",[authJwt.verifyToken],  leadTeamsController.getLeadTeamsById);
router.delete("/deleteLeadTeams", [authJwt.verifyToken], leadTeamsController.deleteLeadTeams);
router.put("/updateLeadTeams", [authJwt.verifyToken], upload.none(), leadTeamsController.updateLeadTeams);


module.exports = router;