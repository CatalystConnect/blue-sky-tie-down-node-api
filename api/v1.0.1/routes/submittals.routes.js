var express = require("express");
var router = express.Router();
const submittalsController = require("../controllers/submittals.controller");
var { authJwt } = require("../middleware");
let { upload } = require("../../../config/multer.config");

// Create
router.post("/submittals", [authJwt.verifyToken], submittalsController.addSubmittal);

// Read All
router.get("/submittals", [authJwt.verifyToken], submittalsController.getAllSubmittals);

// Read One
router.get("/getSubmittalById", [authJwt.verifyToken], submittalsController.getSubmittalById);

// Update
router.put("/updateSubmittal", [authJwt.verifyToken], submittalsController.updateSubmittal);

// Delete
router.delete("/deleteSubmittal", [authJwt.verifyToken], submittalsController.deleteSubmittal);

module.exports = router;
