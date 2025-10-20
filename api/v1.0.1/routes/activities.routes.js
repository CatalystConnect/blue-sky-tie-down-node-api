var express = require("express");
var router = express.Router();
const controller = require("../controllers/activities.controller");
var { authJwt } = require("../middleware");


/*getUserById*/
router.get("/activities/getActivitiesById", [authJwt.verifyToken],[controller.validate("getActivitiesById")], controller.getActivitiesById);

module.exports = router;
