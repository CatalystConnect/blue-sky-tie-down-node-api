var express = require("express");
var router = express.Router();
const itemLinkscontroller = require("../controllers/itemLinks.controller");
var { authJwt } = require("../middleware");

/*itemLinks*/
router.post("/itemLinks/addItemLinks",[authJwt.verifyToken],  itemLinkscontroller.addItemLink);
router.get("/itemLinks/getAllItemLinks",[authJwt.verifyToken],  itemLinkscontroller.getAllItemLinks);
router.put("/itemLinks/updateItemLinks",[authJwt.verifyToken],  itemLinkscontroller.updateItemLinks);
router.delete("/itemLinks/deleteItemLinks",[authJwt.verifyToken],itemLinkscontroller.deleteItemLinks);


module.exports = router;
