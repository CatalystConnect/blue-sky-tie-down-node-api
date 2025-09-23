var express = require("express");
var router = express.Router();
const leadTagscontroller = require("../controllers/leadTags.controller");
var { authJwt } = require("../middleware");

/*leadTags*/
router.post("/leadTags/addleadTags",[authJwt.verifyToken],  leadTagscontroller.addleadTags);
router.get("/leadTags/getAllleadTags", [authJwt.verifyToken],leadTagscontroller.getAllleadTags);
router.get("/leadTags/getleadTagsById",[authJwt.verifyToken],  leadTagscontroller.getleadTagsById);
router.delete("/leadTags/deleteleadTags", [authJwt.verifyToken], leadTagscontroller.deleteleadTags);
router.put("/leadTags/updateleadTags", [authJwt.verifyToken], leadTagscontroller.updateleadTags);



module.exports = router;
