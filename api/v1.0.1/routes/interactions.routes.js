var express = require("express");
var router = express.Router();
const interactionsController = require("../controllers/interactions.controller");
var { authJwt } = require("../middleware");
let { upload } = require("../../../config/multer.config");
/*interactions*/
router.post("/interactions/",[authJwt.verifyToken], upload.none(), interactionsController.addInteractions);
router.get("/getAllinteractionByLeadId", [authJwt.verifyToken],interactionsController.getAllinteractionByLeadId);


module.exports = router;