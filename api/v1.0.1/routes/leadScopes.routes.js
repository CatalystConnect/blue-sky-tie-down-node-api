var express = require("express");
var router = express.Router();
const leadScopesController = require("../controllers/leadScopes.controller");
var { authJwt } = require("../middleware");
let { upload } = require("../../../config/multer.config");

// Create a new lead-scopes
router.post("/lead-scopes", [authJwt.verifyToken],[leadScopesController.validate("addLeadScopes")], leadScopesController.addLeadScopes);

// Get all lead-scopes
router.get("/lead-scopes", [authJwt.verifyToken], leadScopesController.findAllLeadScopes);

// Get single lead-scopes by id
router.get("/getLeadScopesById", [authJwt.verifyToken], leadScopesController.getLeadScopesById);

// Update lead-scopes by id
router.put("/updateLeadScopes", [authJwt.verifyToken], [leadScopesController.validate("updateLeadScopes")], leadScopesController.updateLeadScopes);

// Delete lead-scopes by id
router.delete("/deleteLeadScopes", [authJwt.verifyToken], leadScopesController.deleteLeadScopes);

module.exports = router;
