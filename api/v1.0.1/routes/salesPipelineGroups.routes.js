var express = require("express");
var router = express.Router();
const controller = require("../controllers/salesPipelineGroups.controller");
var { authJwt } = require("../middleware");


/*addSalesPipelinesGroups*/
// router.post("/sales-pipelines-groups",[authJwt.verifyToken],  controller.addSalesPipelinesGroups);

// // /*getAllSalesPipelinesGroups*/
// router.get("/sales-pipelines-groups",[authJwt.verifyToken],  controller.getAllSalesPipelinesGroups);

// // /*getSalesPipelinesGroupsById*/
// router.get("/getSalesPipelinesGroupsById",[authJwt.verifyToken], [controller.validate("getSalesPipelinesGroupsById")], controller.getSalesPipelinesGroupsById);

// // /*updateSalesPipelinesGroups*/
// router.put("/updateSalesPipelinesGroups",[authJwt.verifyToken], [controller.validate("getSalesPipelinesGroupsById")], controller.updateSalesPipelinesGroups);

// /*deleteSalesPipelinesGroups*/
// router.delete("/deleteSalesPipelinesGroups",[authJwt.verifyToken], [controller.validate("getSalesPipelinesGroupsById")], controller.deleteSalesPipelinesGroups);

module.exports = router;
