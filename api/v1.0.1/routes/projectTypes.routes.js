var express = require("express");
var router = express.Router();
const projectTypesController = require("../controllers/projectTypes.controller");
var { authJwt } = require("../middleware");

/*projectTypes*/
router.post("/projectTypes/addProjectTypes",[authJwt.verifyToken], [projectTypesController.validate("addProjectTypes")], projectTypesController.addProjectTypes);
router.get("/projectTypes/getAllProjectTypes", [authJwt.verifyToken],projectTypesController.getAllProjectTypes);
router.get("/projectTypes/getProjectTypesById",[authJwt.verifyToken],  projectTypesController.getProjectTypesById);
router.delete("/projectTypes/deleteProjectTypes", [authJwt.verifyToken], projectTypesController.deleteProjectTypes);
router.put("/projectTypes/updateProjectTypes", [authJwt.verifyToken], [projectTypesController.validate("updateProjectTypes")], projectTypesController.updateProjectTypes);


module.exports = router;