var express = require("express");
var router = express.Router();
const teamsCodesController = require("../controllers/termsCodes.controller");
var { authJwt } = require("../middleware");
let { upload } = require("../../../config/multer.config");

/*Teams*/
router.post("/terms",[authJwt.verifyToken], upload.none(), teamsCodesController.addTeams);
router.get("/terms", [authJwt.verifyToken],teamsCodesController.getAllTeams);
router.get("/getTeamsById",[authJwt.verifyToken],  teamsCodesController.getTeamsById);
router.delete("/deleteTeams", [authJwt.verifyToken], teamsCodesController.deleteTeams);
router.put("/updateTeams", [authJwt.verifyToken], upload.none(), teamsCodesController.updateTeams);


module.exports = router;