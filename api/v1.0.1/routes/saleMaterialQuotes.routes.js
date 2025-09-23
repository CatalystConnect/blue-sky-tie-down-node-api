var express = require("express");
var router = express.Router();
const saleMaterialQuotesController = require("../controllers/saleMaterialQuotes.controller");
var { authJwt } = require("../middleware");

/*tags*/
router.post("/saleMaterial/addSaleMaterialQuotes",[authJwt.verifyToken], [saleMaterialQuotesController.validate("addSaleMaterialQuotes")],saleMaterialQuotesController.addSaleMaterialQuotes);
router.get("/saleMaterial/getAllSaleMaterialQuotes",[authJwt.verifyToken],  saleMaterialQuotesController.getAllSaleMaterialQuotes);
router.get("/saleMaterial/getSaleMaterialQuotesById",[authJwt.verifyToken],  saleMaterialQuotesController.getSaleMaterialQuotesById);
router.delete("/saleMaterial/deleteSaleMaterialQuotes",[authJwt.verifyToken], saleMaterialQuotesController.deleteSaleMaterialQuotes);
router.put("/saleMaterial/updateSaleMaterialQuotes",[authJwt.verifyToken], saleMaterialQuotesController.updateSaleMaterialQuotes);

router.post("/saleMaterial/CheckleadContractor",[authJwt.verifyToken], saleMaterialQuotesController.CheckleadContractor);

router.get("/saleMaterial/getAllItemAndServicesTypeItem",[authJwt.verifyToken], saleMaterialQuotesController.getAllItemAndServicesTypeItem);
router.get("/saleMaterial/getAllItemAndServicesTypeItemByID",[authJwt.verifyToken], saleMaterialQuotesController.getAllItemAndServicesTypeItemByID);
module.exports = router;

