var express = require("express");
var router = express.Router();
const budgetBooksController = require("../controllers/budgetBooks.controller");
var { authJwt } = require("../middleware");
let { upload,multiUpload } = require("../../../config/multer.config");

// Create a new budgetBooks
router.post("/budget-books", [authJwt.verifyToken], upload.none(), budgetBooksController.addBudgetBooks);
// router.get("/budget-books", [authJwt.verifyToken], budgetBooksController.getAllBudgetBooks);

module.exports = router;