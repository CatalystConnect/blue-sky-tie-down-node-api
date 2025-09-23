var express = require("express");
var router = express.Router();
const departmentController = require("../controllers/departments.controller");
var { authJwt } = require("../middleware");

/*Depertments*/
router.post("/departments/",[authJwt.verifyToken],  departmentController.addDepartments);
router.get("/departments", [authJwt.verifyToken],departmentController.getAllDepartments);
router.get("/getDepartmentById",[authJwt.verifyToken],  departmentController.getDepartmentById);
router.delete("/deleteDepartment", [authJwt.verifyToken], departmentController.deleteDepartment);
router.put("/updateDepartment", [authJwt.verifyToken], departmentController.updateDepartment);



module.exports = router;
