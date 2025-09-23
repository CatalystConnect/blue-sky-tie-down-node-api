var express = require("express");
var router = express.Router();
const tagsController = require("../controllers/tags.controller");
var { authJwt } = require("../middleware");

/*tags*/
router.post("/tags/addTags",[authJwt.verifyToken], [tagsController.validate("addTags")], tagsController.addTags);
router.get("/tags/getAllTags",[authJwt.verifyToken],  tagsController.getAllTags);
router.get("/tags/getTagsById",[authJwt.verifyToken],  tagsController.getTagsById);
router.delete("/tags/deleteTags",[authJwt.verifyToken], tagsController.deleteTags);
router.put("/tags/updateTags",[authJwt.verifyToken], [tagsController.validate("updateTags")], tagsController.updateTags);


module.exports = router;

