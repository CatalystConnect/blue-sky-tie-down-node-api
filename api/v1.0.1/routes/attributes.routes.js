var express = require("express");
var router = express.Router();
const controller = require("../controllers/attribute.controller");
var { authJwt } = require("../middleware");

/*addAttribute*/
router.post("/attribute/addAttribute",[authJwt.verifyToken], controller.addAttribute);

/*getAllAttributes*/
router.get("/attribute/getAllAttributes",[authJwt.verifyToken], controller.getAllAttributes);

/*getAttributesById*/
router.get("/attribute/getAttributesById",[authJwt.verifyToken], [controller.validate("getAttributesById")], controller.getAttributesById);

/*updateAttributesById*/
router.put("/attribute/updateAttributesById",[authJwt.verifyToken], [controller.validate("getAttributesById")], controller.updateAttributesById);

/*updateAttributesById*/
router.delete("/attribute/deleteAttributesById",[authJwt.verifyToken], [controller.validate("getAttributesById")], controller.deleteAttributesById);

module.exports = router;
