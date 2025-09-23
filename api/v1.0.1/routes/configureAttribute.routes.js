var express = require("express");
var router = express.Router();
const controller = require("../controllers/configureAttribute.controller");
var { authJwt } = require("../middleware");

/*addConfigureAttribute*/
router.post("/configureAttribute/addConfigureAttribute", controller.addConfigureAttribute);

/*getAllAttributes*/
router.get("/configureAttribute/getAllConfigAttributes",[authJwt.verifyToken],[controller.validate("getAllConfigAttributes")], controller.getAllConfigAttributes);

/*getConfigAttributesById*/
router.get("/configureAttribute/getConfigAttributesById",[authJwt.verifyToken],[controller.validate("getConfigAttributesById")], controller.getConfigAttributesById);

/*updateAttributesById*/
router.put("/configureAttribute/updateConfigAttributesById",[authJwt.verifyToken],[controller.validate("getConfigAttributesById")], controller.updateConfigAttributesById);

/*updateAttributesById*/
router.delete("/configureAttribute/deleteConfigAttributesById",[authJwt.verifyToken],[controller.validate("getConfigAttributesById")], controller.deleteConfigAttributesById);

module.exports = router;
