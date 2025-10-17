var express = require("express");
var router = express.Router();
const salesPipelinesLeadsController = require("../controllers/salesPipelinesLeads.controller");
var { authJwt } = require("../middleware");


/*salesPipelinesLeads*/
router.get("/sales-pipelines-leads", [authJwt.verifyToken], salesPipelinesLeadsController.salesPipelinesLeads);


module.exports = router;
