var express = require("express");
var router = express.Router();
const contractComponentsController = require("../controllers/contractComponents.controller");
var { authJwt } = require("../middleware");
let { upload } = require("../../../config/multer.config");

// Create
router.post("/contract-components", [authJwt.verifyToken], contractComponentsController.addContractComponents);

// Read All
router.get("/contract-components", [authJwt.verifyToken], contractComponentsController.getAllContractComponents);

// Read One
router.get("/getContractComponentsById", [authJwt.verifyToken], contractComponentsController.getContractComponentsById);

// Update
router.put("/updateContractComponents", [authJwt.verifyToken], contractComponentsController.updateContractComponents);

// Delete
router.delete("/deleteContractComponents", [authJwt.verifyToken], contractComponentsController.deleteContractComponents);

module.exports = router;
