var express = require("express");
var router = express.Router();
const LeadStatusescontroller = require("../controllers/leadStatuses.controller");
var { authJwt } = require("../middleware");
let { upload } = require("../../../config/multer.config");

/*LeadStatuses*/
router.post("/leadStatuses/addleadStatuses",[authJwt.verifyToken], upload.none(), LeadStatusescontroller.addleadStatuses);
router.get("/leadStatuses/getAllleadStatuses", [authJwt.verifyToken],LeadStatusescontroller.getAllleadStatuses);
router.get("/leadStatuses/getleadStatusesById",[authJwt.verifyToken],  LeadStatusescontroller.getleadStatusesById);
router.delete("/leadStatuses/deleteleadStatuses", [authJwt.verifyToken], LeadStatusescontroller.deleteleadStatuses);
router.put("/leadStatuses/updateleadStatuses", [authJwt.verifyToken],upload.none(), LeadStatusescontroller.updateleadStatuses);


module.exports = router;