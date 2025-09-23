var express = require("express");
var router = express.Router();
const departmentcontroller = require("../controllers/departments.controller");
var { authJwt } = require("../middleware");

/*Depertments*/
router.post("/departments/addDepartments",[authJwt.verifyToken],  departmentcontroller.addDepartments);
router.get("/departments/getAllDepartments", [authJwt.verifyToken],departmentcontroller.getAllDepartments);
router.get("/departments/getDepartmentById",[authJwt.verifyToken],  departmentcontroller.getDepartmentById);
router.delete("/departments/deleteDepartment", [authJwt.verifyToken], departmentcontroller.deleteDepartment);
router.put("/departments/updateDepartment", [authJwt.verifyToken], departmentcontroller.updateDepartment);



module.exports = router;
