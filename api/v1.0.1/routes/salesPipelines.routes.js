var express = require("express");
var router = express.Router();
const salesPipelinesController = require("../controllers/salesPipelines.controller");
var { authJwt } = require("../middleware");

// Create a new salesPipelines
router.post("/sales-pipelines", [authJwt.verifyToken], [salesPipelinesController.validate("addSalesPipelines")], salesPipelinesController.addSalesPipelines);
router.get("/sales-pipelines",[authJwt.verifyToken],  salesPipelinesController.getAllSalesPipelines);
router.get("/getSalesPipelinesById",[authJwt.verifyToken],  salesPipelinesController.getSalesPipelinesById);
router.delete("/deleteSalesPipelines",[authJwt.verifyToken], salesPipelinesController.deleteSalesPipelines);
router.put("/updateSalesPipelines",[authJwt.verifyToken], [salesPipelinesController.validate("updateSalesPipelines")], salesPipelinesController.updateSalesPipelines);

module.exports = router;
