var express = require("express");
var router = express.Router();
const controller = require("../controllers/project.controller");
var { authJwt } = require("../middleware");
let { upload,multiUpload } = require("../../../config/multer.config");


/*addProject*/
router.post("/project/addProject", [authJwt.verifyToken,multiUpload ], controller.addProject);

// /*getAllProject*/
router.get("/project/getAllProject",[authJwt.verifyToken],  controller.getAllProject);

// /*getProjectById*/
 router.get("/project/getProjectById",[authJwt.verifyToken], controller.getProjectById);

// /*updateProject*/
router.put("/project/updateProject",[authJwt.verifyToken, multiUpload],  controller.updateProject);

// /*deleteRole*/
router.delete("/project/deleteProject",[authJwt.verifyToken],  controller.deleteProject);

/*set default lead*/
router.put("/project/setDefaultLead",[authJwt.verifyToken],  controller.setDefaultLead);

router.put("/project/updateProjectPlanSet",[authJwt.verifyToken, upload.none()],  controller.updateProjectPlanSet);
router.post("/project/addProjectPlanSet", [authJwt.verifyToken, upload.none()], controller.addProjectPlanSet);

// Add Project Notes
router.post("/project/addProjectNotes", [authJwt.verifyToken], controller.addProjectNotes);

// List Project Notes
router.get("/project-notes", [authJwt.verifyToken], controller.listProjectNotes);

// Update Project Notes
router.put("/updateProjectNotes", [authJwt.verifyToken], controller.updateProjectNotes);

// Delete Project Notes
router.delete("/deleteProjectNotes", [authJwt.verifyToken], controller.deleteProjectNotes);

router.get("/getProjectPlanSet", [authJwt.verifyToken], controller.getProjectPlanSet);
router.put("/updateProjectPlanSetById", [authJwt.verifyToken,upload.none()], controller.updateProjectPlanSetById);
router.delete("/deleteProjectPlanSet", [authJwt.verifyToken,upload.none()], controller.deleteProjectPlanSet);
router.get("/getProjectPlanSetById", [authJwt.verifyToken], controller.getProjectPlanSetById);

router.get("/getAllProjectDataStatusNew", [authJwt.verifyToken], controller.getAllProjectDataStatusNew);

router.put("/updateProjectType", [authJwt.verifyToken,upload.none()], controller.updateProjectType); 

router.put("/updateProjecttakeOffStatusDataCollect", [authJwt.verifyToken], controller.updateProjecttakeOffStatusDataCollect); 
router.put("/updateProjecttakeOffStatusAssignToBudget", [authJwt.verifyToken], controller.updateProjecttakeOffStatusAssignToBudget);

router.get("/getAllProjectDatatakeoffStatusDataCollected", [authJwt.verifyToken], controller.getAllProjectDatatakeoffStatusDataCollected);
router.get("/getAllProjectDatatakeoffAssignToTeam", [authJwt.verifyToken], controller.getAllProjectDatatakeoffAssignToTeam);

router.put("/updateProjecttakeOffStatus", [authJwt.verifyToken], controller.updateProjecttakeOffStatus);


module.exports = router

