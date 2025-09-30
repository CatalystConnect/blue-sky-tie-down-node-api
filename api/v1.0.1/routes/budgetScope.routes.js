var express = require("express");
var router = express.Router();
const budgetScope = require("../controllers/budgetScope.controller");
var { authJwt } = require("../middleware");
let { upload } = require("../../../config/multer.config");

/*budget-scope*/
router.get("/get-budget-scopes", [authJwt.verifyToken],budgetScope.getAllBudgetScopes);
router.get("/get-budget-scope",[authJwt.verifyToken],  budgetScope.getBudgetScopeById);
router.post("/save-budget-scope",[authJwt.verifyToken], upload.none(), budgetScope.addBudgetScope);
router.put("/update-budget-scope", [authJwt.verifyToken], upload.none(), budgetScope.updateBudgetScope);
router.delete("/delete-budget-scope", [authJwt.verifyToken], budgetScope.deleteBudgetScope);

module.exports = router;