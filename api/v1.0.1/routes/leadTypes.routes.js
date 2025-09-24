var express = require("express");
var router = express.Router();
const LeadTypescontroller = require("../controllers/leadTypes.controller");
var { authJwt } = require("../middleware");
let { upload } = require("../../../config/multer.config");

/*LeadTypes*/
router.post("/leadTypes/addleadTypes",[authJwt.verifyToken], upload.none(), LeadTypescontroller.addleadType);
router.get("/leadTypes/getAllleadTypes", [authJwt.verifyToken],LeadTypescontroller.getAllleadTypes);
router.get("/leadTypes/getleadTypesById",[authJwt.verifyToken],  LeadTypescontroller.getleadTypeById);
router.delete("/leadTypes/deleteleadTypes", [authJwt.verifyToken], LeadTypescontroller.deleteleadType);
router.put("/leadTypes/updateleadTypes", [authJwt.verifyToken],upload.none(), LeadTypescontroller.updateleadTypes);


module.exports = router;