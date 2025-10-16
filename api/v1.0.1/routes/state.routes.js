var express = require("express");
var router = express.Router();
const stateController = require("../controllers/state.controller");
var { authJwt } = require("../middleware");
let { upload } = require("../../../config/multer.config");
/*stateController*/
router.post("/state/addState",[authJwt.verifyToken], stateController.addState);
router.get("/state/getAllState",[authJwt.verifyToken],  stateController.getAllState);
router.get("/state/getStateById",[authJwt.verifyToken],  stateController.getStateById);
router.delete("/state/deleteState",[authJwt.verifyToken], stateController.deleteState);
router.put("/state/updateState",[authJwt.verifyToken], stateController.updateState);


module.exports = router;

