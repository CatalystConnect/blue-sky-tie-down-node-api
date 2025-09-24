var express = require("express");
var router = express.Router();
const budgetKeyAreasController = require("../controllers/budgetKeyAreas.controller");
var { authJwt } = require("../middleware");
let { upload } = require("../../../config/multer.config");

/*budget-key-areas*/
router.post("/budget-key-areas",[authJwt.verifyToken], upload.none(), budgetKeyAreasController.addBudgetKeyAreas);
router.get("/budget-key-areas", [authJwt.verifyToken],budgetKeyAreasController.getAllBudgetKeyAreas);
router.get("/getBudgetKeyAreasById",[authJwt.verifyToken],  budgetKeyAreasController.getBudgetKeyAreasById);
router.delete("/deleteBudgetKeyAreas", [authJwt.verifyToken], budgetKeyAreasController.deleteBudgetKeyAreas);
router.put("/updateBudgetKeyAreas", [authJwt.verifyToken], upload.none(), budgetKeyAreasController.updateBudgetKeyAreas);


module.exports = router;