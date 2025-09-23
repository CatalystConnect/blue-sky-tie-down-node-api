var express = require("express");
var router = express.Router();
const serviceTypeItemController = require("../controllers/ServiceTypeItem.controller");
var { authJwt } = require("../middleware")
let { upload ,multiUpload } = require("../../../config/multer.config");

router.post("/serviceTypeItem/addServiceTypeItem",[authJwt.verifyToken],  serviceTypeItemController.addServiceTypeItem);
router.get("/serviceTypeItem/getServiceTypeItemById",[authJwt.verifyToken],  serviceTypeItemController.getServiceTypeItemById);
router.get("/serviceTypeItem/getAllServiceTypeItems",[authJwt.verifyToken],  serviceTypeItemController.getAllServiceTypeItems);
router.delete("/serviceTypeItem/deleteServiceTypeItems",[authJwt.verifyToken], serviceTypeItemController.deleteServiceTypeItems);
router.put("/serviceTypeItem/updateServiceTypeItems",[authJwt.verifyToken],  serviceTypeItemController.updateServiceTypeItems);


router.get("/serviceTypeItem/getAllServiceTypeById",[authJwt.verifyToken],serviceTypeItemController.getAllServiceTypeById);
  
router.post('/serviceTypeItem/importServiceTypeItem', upload.single('file'), serviceTypeItemController.importServiceTypeItem);

module.exports = router;