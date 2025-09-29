var express = require("express");
var router = express.Router();
const controller = require("../controllers/project.controller");
var { authJwt } = require("../middleware");
let { upload } = require("../../../config/multer.config");


/*addProject*/
router.post("/project/addProject", [authJwt.verifyToken, upload.none()], controller.addProject);

// /*getAllProject*/
router.get("/project/getAllProject",[authJwt.verifyToken],  controller.getAllProject);

// /*getProjectById*/
 router.get("/project/getProjectById",[authJwt.verifyToken], controller.getProjectById);

// /*updateProject*/
router.put("/project/updateProject",[authJwt.verifyToken, upload.none()],  controller.updateProject);

// /*deleteRole*/
router.delete("/project/deleteProject",[authJwt.verifyToken],  controller.deleteProject);

module.exports = router;

