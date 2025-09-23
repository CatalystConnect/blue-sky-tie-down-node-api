var express = require("express");
var router = express.Router();
const leadTeamsController = require("../controllers/leadTeams.controller");
var { authJwt } = require("../middleware");

/*leadTeams*/
router.post("/leadTeams/addLeadTeams",[authJwt.verifyToken],  leadTeamsController.addLeadTeams);
router.get("/leadTeams/getAllLeadTeams", [authJwt.verifyToken],leadTeamsController.getAllLeadTeams);
router.get("/leadTeams/getLeadTeamsById",[authJwt.verifyToken],  leadTeamsController.getLeadTeamsById);
router.delete("/leadTeams/deleteLeadTeams", [authJwt.verifyToken], leadTeamsController.deleteLeadTeams);
router.put("/leadTeams/updateLeadTeams", [authJwt.verifyToken], leadTeamsController.updateLeadTeams);


module.exports = router;