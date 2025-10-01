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

/*set default lead*/
router.put("/project/setDefaultLead",[authJwt.verifyToken],  controller.setDefaultLead);

router.put("/project/updateProjectPlanSet",[authJwt.verifyToken, upload.none()],  controller.updateProjectPlanSet);
// Add Project Notes
router.post("/project/addProjectNotes", [authJwt.verifyToken], controller.addProjectNotes);

// List Project Notes
router.get("/project-notes", [authJwt.verifyToken], controller.listProjectNotes);

// Delete Project Notes
router.delete("/deleteProjectNotes", [authJwt.verifyToken], controller.deleteProjectNotes);


module.exports = router;

