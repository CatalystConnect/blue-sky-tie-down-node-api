var express = require("express");
var router = express.Router();
const controller = require("../controllers/auth.controller");
var { authJwt } = require("../middleware");
let { upload,multiUpload } = require("../../../config/multer.config");

/*register*/
router.post("/users", multiUpload, [controller.validate("register")], controller.register);

/*login*/
router.post("/auth/login", [controller.validate("login")], controller.login);

/*getAllUsers*/
router.get("/users", [authJwt.verifyToken], controller.getAllUsers);

/*getUserById*/
router.get("/getUserById", [authJwt.verifyToken],[controller.validate("getUserById")], controller.getUserById);

/*updateUser*/
router.put("/updateUser", multiUpload,[authJwt.verifyToken], controller.updateUser);

/*deleteUser*/
router.delete("/deleteUser", [authJwt.verifyToken],[controller.validate("getUserById")], controller.deleteUser);

module.exports = router;
