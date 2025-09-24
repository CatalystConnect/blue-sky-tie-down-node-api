var express = require("express");
var router = express.Router();
const interactionTypescontroller = require("../controllers/interactionTypes.controller");
var { authJwt } = require("../middleware");
let { upload } = require("../../../config/multer.config");
/*InteractionTypes*/
router.post("/interactionTypes/addinteractionTypes",[authJwt.verifyToken], upload.none(), interactionTypescontroller.addinteractionTypes);
router.get("/interactionTypes/getAllinteractionTypes", [authJwt.verifyToken],interactionTypescontroller.getAllinteractionTypes);
router.get("/interactionTypes/getinteractionTypesById",[authJwt.verifyToken],  interactionTypescontroller.getinteractionTypesById);
router.delete("/interactionTypes/deleteinteractionTypes", [authJwt.verifyToken], interactionTypescontroller.deleteinteractionTypes);
router.put("/interactionTypes/updateinteractionTypes", [authJwt.verifyToken],upload.none(), interactionTypescontroller.updateinteractionTypes);


module.exports = router;