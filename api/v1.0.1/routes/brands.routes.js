var express = require("express");
var router = express.Router();
const controller = require("../controllers/brands.controller");
var { authJwt } = require("../middleware");

// Create a new brand
router.post("/brands/addBrand", [authJwt.verifyToken],[controller.validate("addBrand")], controller.addBrand);

// Get all brands
router.get("/brands", [authJwt.verifyToken], controller.findAllBrands);

// Get single brand by id
router.get("/brands/:id", [authJwt.verifyToken], controller.findOneBrand);

// Update brand by id
router.put("/brands/updateBrand/:id", [authJwt.verifyToken], [controller.validate("updateBrand")], controller.updateBrand);

// Delete brand by id
router.delete("/brands/deleteBrand/:id", [authJwt.verifyToken], controller.deleteBrand);

module.exports = router;
