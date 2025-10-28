var express = require("express");
var router = express.Router();
const budgetBooksController = require("../controllers/budgetBooks.controller");
var { authJwt } = require("../middleware");
let { upload,multiUpload } = require("../../../config/multer.config");

// Create a new budgetBooks
router.post("/budget-books", [authJwt.verifyToken], upload.any(), budgetBooksController.addBudgetBooks);
router.get("/budget-books", [authJwt.verifyToken], budgetBooksController.getAllBudgetBooks);
router.get("/getBudgetBooksById", [authJwt.verifyToken], budgetBooksController.getBudgetBooksById);
router.put("/updateBudgetBooks", [authJwt.verifyToken], upload.any(), budgetBooksController.updateBudgetBooks);
router.delete("/deleteBudgetBooks", [authJwt.verifyToken], budgetBooksController.deleteBudgetBooks);

router.get("/budget-category", [authJwt.verifyToken], budgetBooksController.getAllBudgetCategory);

router.delete("/budget-document-delete/:id", [authJwt.verifyToken], budgetBooksController.budgetDocumentDelete);


module.exports = router;