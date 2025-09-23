var express = require("express");
var router = express.Router();
const controller = require("../controllers/project.controller");
var { authJwt } = require("../middleware");


/*addProject*/
router.post("/project/addProject",[authJwt.verifyToken], [controller.validate("addProject")], controller.addProject);

/*getAllProject*/
router.get("/project/getAllProject",[authJwt.verifyToken],  controller.getAllProject);

/*getProjectById*/
router.get("/project/getProjectById",[authJwt.verifyToken], [controller.validate("getProjectById")], controller.getProjectById);

/*updateProject*/
router.put("/project/updateProject",[authJwt.verifyToken], [controller.validate("getProjectById")], controller.updateProject);

/*deleteRole*/
router.delete("/project/deleteProject",[authJwt.verifyToken], [controller.validate("getProjectById")], controller.deleteProject);

module.exports = router;

