var express = require("express");
var router = express.Router();
const budgetCategory = require("../controllers/budgetCategory.controller");
var { authJwt } = require("../middleware");
let { upload } = require("../../../config/multer.config");

/*budget-category*/
router.get("/get-budget-categories", [authJwt.verifyToken],budgetCategory.getAllBudgetCategories);
router.get("/get-budget-category",[authJwt.verifyToken],  budgetCategory.getBudgetCategoryById);
router.post("/save-budget-category",[authJwt.verifyToken], upload.none(), budgetCategory.addBudgetCategory);
router.put("/update-budget-category", [authJwt.verifyToken], upload.none(), budgetCategory.updateBudgetCategory);
router.delete("/delete-budget-category", [authJwt.verifyToken], budgetCategory.deleteBudgetCategory);

module.exports = router;