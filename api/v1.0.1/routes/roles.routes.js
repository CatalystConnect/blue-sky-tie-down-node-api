var express = require("express");
var router = express.Router();
const controller = require("../controllers/roles.controller");
var { authJwt } = require("../middleware");


/*addRole*/
router.post("/role/addRole",[authJwt.verifyToken],  controller.addRole);

/*getAllRoles*/
router.get("/role/getAllRoles",[authJwt.verifyToken],  controller.getAllRoles);

/*getRoleById*/
router.get("/role/getRoleById",[authJwt.verifyToken], [controller.validate("getRoleById")], controller.getRoleById);

/*updateRole*/
router.put("/role/updateRole",[authJwt.verifyToken], [controller.validate("getRoleById")], controller.updateRole);

/*deleteRole*/
router.delete("/role/deleteRole",[authJwt.verifyToken], [controller.validate("getRoleById")], controller.deleteRole);

module.exports = router;

